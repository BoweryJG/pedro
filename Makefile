# Makefile for Dr. Pedro's Dental Practice Application

.PHONY: help install dev build deploy clean test logs health

# Default target
help:
	@echo "Available commands:"
	@echo "  make install     - Install dependencies for local development"
	@echo "  make dev         - Start development environment with Docker"
	@echo "  make build       - Build production Docker images"
	@echo "  make deploy      - Deploy to production"
	@echo "  make test        - Run tests in Docker"
	@echo "  make logs        - View application logs"
	@echo "  make health      - Check service health"
	@echo "  make clean       - Clean up Docker resources"
	@echo "  make shell-backend  - Open shell in backend container"
	@echo "  make shell-frontend - Open shell in frontend container"

# Install dependencies for local development
install:
	npm run install:all

# Development environment
dev:
	docker-compose up -d
	@echo "Starting development environment..."
	@echo "Frontend: http://localhost:5173"
	@echo "Backend:  http://localhost:3001"
	@echo "Redis:    redis://localhost:6379"
	@./scripts/docker-health-check.sh wait

dev-logs:
	docker-compose logs -f

dev-stop:
	docker-compose down

dev-restart:
	docker-compose restart

# Production build
build:
	docker-compose -f docker-compose.prod.yml build

build-no-cache:
	docker-compose -f docker-compose.prod.yml build --no-cache

# Production deployment
deploy:
	./scripts/docker-deploy.sh deploy

deploy-status:
	./scripts/docker-deploy.sh status

deploy-logs:
	./scripts/docker-deploy.sh logs

# Testing
test:
	docker-compose run --rm frontend npm test
	docker-compose run --rm backend npm test

test-frontend:
	docker-compose run --rm frontend npm test

test-backend:
	docker-compose run --rm backend npm test

# Health checks
health:
	./scripts/docker-health-check.sh all

health-wait:
	./scripts/docker-health-check.sh wait

# Logs
logs:
	docker-compose logs -f

logs-frontend:
	docker-compose logs -f frontend

logs-backend:
	docker-compose logs -f backend

logs-redis:
	docker-compose logs -f redis

# Shell access
shell-backend:
	docker-compose exec backend sh

shell-frontend:
	docker-compose exec frontend sh

shell-redis:
	docker-compose exec redis redis-cli

# Clean up
clean:
	docker-compose down -v
	docker system prune -f

clean-all:
	docker-compose down -v
	docker-compose -f docker-compose.prod.yml down -v
	docker system prune -af
	docker volume prune -f

# Database operations
db-migrate:
	docker-compose exec backend npm run db:migrate

db-seed:
	docker-compose exec backend npm run db:seed

# Backup operations
backup:
	@mkdir -p backups
	@docker run --rm \
		-v pedro_redis-data:/data \
		-v $(PWD)/backups:/backup \
		alpine tar czf /backup/redis-backup-$(shell date +%Y%m%d-%H%M%S).tar.gz -C / data
	@echo "Backup created in ./backups/"

# Environment setup
env-setup:
	@echo "Creating example environment files..."
	@cp backend/.env.example backend/.env 2>/dev/null || echo "backend/.env already exists"
	@cp frontend/.env.example frontend/.env.local 2>/dev/null || echo "frontend/.env.local already exists"
	@echo "Environment files created. Please update them with your values."

# Docker compose shortcuts
up: dev
down: dev-stop
restart: dev-restart
ps:
	docker-compose ps

# Production shortcuts
prod-up:
	docker-compose -f docker-compose.prod.yml up -d

prod-down:
	docker-compose -f docker-compose.prod.yml down

prod-ps:
	docker-compose -f docker-compose.prod.yml ps

prod-logs:
	docker-compose -f docker-compose.prod.yml logs -f