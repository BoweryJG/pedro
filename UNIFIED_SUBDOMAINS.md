# Unified Subdomain Architecture

## Overview
All subdomains have been unified into a single React application for better maintainability, performance, and code reuse.

## Architecture Changes

### Before (Separate Apps)
- 5 separate React applications
- Duplicate dependencies and build processes
- Separate deployments for each subdomain
- Inconsistent user experience

### After (Unified App)
- Single React application with route-based subdomains
- Shared dependencies and components
- Single build and deployment
- Consistent navigation and user experience

## Directory Structure
```
frontend/
├── src/
│   ├── pages/
│   │   ├── tmj/              # TMJ subdomain pages
│   │   ├── implants/         # Implants subdomain pages
│   │   ├── robotic/          # Robotic subdomain pages
│   │   ├── medspa/           # MedSpa subdomain pages
│   │   └── aboutface/        # AboutFace subdomain pages
│   ├── components/
│   │   └── subdomain-components/
│   │       ├── tmj/          # TMJ-specific components
│   │       ├── implants/     # Implants-specific components
│   │       ├── robotic/      # Robotic-specific components
│   │       ├── medspa/       # MedSpa-specific components
│   │       └── aboutface/    # AboutFace-specific components
│   └── data/
│       └── subdomain-content/
│           ├── tmj/          # TMJ content/data
│           ├── implants/     # Implants content/data
│           ├── robotic/      # Robotic content/data
│           ├── medspa/       # MedSpa content/data
│           └── aboutface/    # AboutFace content/data
```

## Routes
- Main site: `/`
- TMJ Subdomain: `/tmj`
- Implants Subdomain: `/implants`
- Robotic Subdomain: `/robotic`
- MedSpa Subdomain: `/medspa`
- AboutFace Subdomain: `/aboutface`

## Subdomain Access
The app supports multiple access methods:

1. **Path-based**: `gregpedromd.com/tmj`
2. **Subdomain URLs**: `tmj.gregpedromd.com` (redirects to `/tmj`)

## Benefits

### Performance
- **Single Bundle**: Reduced initial load time with code splitting
- **Shared Resources**: Common libraries loaded once
- **Optimized Caching**: Better browser caching strategy

### Development
- **Unified Codebase**: Easier to maintain and update
- **Shared Components**: Reuse common UI elements
- **Consistent Styling**: Single source of truth for styles

### Deployment
- **Single Build**: Faster CI/CD pipeline
- **Simplified Hosting**: One deployment to manage
- **Easier Updates**: Deploy all changes at once

## Migration Notes
- All subdomain components have been moved to the main frontend
- Original subdomain folders preserved for reference
- Netlify redirects maintained for backward compatibility
- No breaking changes for existing URLs

## Development
```bash
# Install dependencies
cd frontend
npm install

# Run development server
npm run dev

# Build for production
cd ..
npm run build
```

## Testing Subdomains
Visit the following routes in development:
- http://localhost:5173/tmj
- http://localhost:5173/implants
- http://localhost:5173/robotic
- http://localhost:5173/medspa
- http://localhost:5173/aboutface