# Multi-stage Dockerfile for Dr. Pedro's Dental Practice Application

# Stage 1: Base dependencies
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Stage 2: Frontend dependencies
FROM base AS frontend-deps
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci --legacy-peer-deps --only=production

# Stage 3: Backend dependencies  
FROM base AS backend-deps
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --legacy-peer-deps --only=production

# Stage 4: Frontend builder
FROM base AS frontend-builder
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci --legacy-peer-deps
COPY frontend ./frontend
RUN cd frontend && npm run build:prod

# Stage 5: Backend builder
FROM base AS backend-builder
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --legacy-peer-deps
COPY backend ./backend
# TypeScript compilation if needed
RUN cd backend && npm run build || true

# Stage 6: Frontend production
FROM nginx:alpine AS frontend-prod
RUN apk add --no-cache curl
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html
COPY --from=frontend-builder /app/frontend/nginx.conf /etc/nginx/conf.d/default.conf 2>/dev/null || \
  echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
      try_files $uri $uri/ /index.html; \
    } \
    location /api { \
      proxy_pass http://backend:3001; \
      proxy_http_version 1.1; \
      proxy_set_header Upgrade $http_upgrade; \
      proxy_set_header Connection "upgrade"; \
      proxy_set_header Host $host; \
      proxy_set_header X-Real-IP $remote_addr; \
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
      proxy_set_header X-Forwarded-Proto $scheme; \
    } \
  }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Stage 7: Backend production
FROM base AS backend-prod
RUN apk add --no-cache curl
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy node modules and built application
COPY --from=backend-deps --chown=nodejs:nodejs /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder --chown=nodejs:nodejs /app/backend ./backend

# Switch to non-root user
USER nodejs
WORKDIR /app/backend

EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1
CMD ["node", "server.js"]

# Stage 8: Development environment
FROM base AS development
RUN apk add --no-cache git curl

# Install development dependencies
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/
RUN npm ci --legacy-peer-deps
RUN cd frontend && npm ci --legacy-peer-deps
RUN cd backend && npm ci --legacy-peer-deps

# Copy application code
COPY . .

# Expose ports
EXPOSE 5173 3001

# Development command (can be overridden)
CMD ["npm", "run", "dev:all"]