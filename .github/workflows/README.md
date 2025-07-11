# GitHub Actions CI/CD Pipeline Documentation

This directory contains the CI/CD pipeline configuration for Dr. Pedro's dental practice monorepo.

## Workflow Overview

### 1. CI Pipeline (`ci.yml`)
**Triggers**: Push to main/develop, Pull requests to main
**Purpose**: Continuous integration checks for code quality and build validation

#### Jobs:
- **Frontend Lint**: ESLint validation for TypeScript/React code
- **Frontend TypeCheck**: TypeScript compilation checks
- **Frontend Build**: Production build validation with environment variables
- **Frontend Test**: Jest tests (when available)
- **Backend Lint**: ESLint validation for Node.js code
- **Backend Test**: Backend test suite (when available)
- **Security Scan**: npm audit and CodeQL analysis
- **Dependency Review**: Checks for vulnerable dependencies in PRs
- **Database Check**: Validates migration files
- **Bundle Analysis**: Analyzes frontend bundle size for PRs

### 2. Deploy Pipeline (`deploy.yml`)
**Triggers**: Push to main, Manual workflow dispatch
**Purpose**: Automated deployment to production environments

#### Jobs:
- **Pre-deploy Checks**: Determines what needs deployment based on changes
- **Database Migrations**: Runs Supabase migrations before deployment
- **Deploy Backend**: Deploys to Render with health checks
- **Deploy Frontend**: Deploys to Netlify with preview URLs
- **Post-deploy Verification**: Validates deployment success
- **Rollback**: Automatic rollback on deployment failure

### 3. PR Checks (`pr-checks.yml`)
**Triggers**: Pull request events
**Purpose**: Automated PR validation and preview deployments

#### Jobs:
- **Label PR**: Auto-labels based on changed files
- **PR Size**: Adds size labels (XS/S/M/L/XL)
- **Merge Conflict Check**: Detects merge conflicts
- **Preview Deploy**: Creates Netlify preview for frontend changes
- **Code Coverage**: Runs test coverage analysis
- **Documentation Check**: Warns if code changes lack documentation
- **API Contract Test**: Validates API changes
- **PR Summary**: Posts summary comment with check results

### 4. Scheduled Maintenance (`scheduled.yml`)
**Triggers**: Daily at 2 AM UTC, Manual dispatch
**Purpose**: Regular maintenance and monitoring tasks

#### Jobs:
- **Dependency Updates**: Checks for outdated packages
- **Database Maintenance**: Cleanup and optimization tasks
- **Voice Service Check**: Validates Eleven Labs, Deepgram, Twilio APIs
- **Performance Check**: Lighthouse CI performance monitoring
- **Backup Verification**: Ensures database backups are current

### 5. Security Scanning (`security.yml`)
**Triggers**: Push to main/develop, PRs, Weekly schedule
**Purpose**: Comprehensive security vulnerability scanning

#### Jobs:
- **CodeQL Analysis**: JavaScript/TypeScript security analysis
- **Dependency Scan**: npm audit for vulnerabilities
- **Secret Scan**: TruffleHog and Gitleaks for exposed secrets
- **OWASP Check**: Dependency vulnerability analysis
- **Security Headers**: Validates HTTP security headers
- **API Security**: OWASP ZAP API security testing

## Environment Variables

### Required Secrets (GitHub Settings → Secrets):

#### Frontend Deployment:
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `VITE_BACKEND_URL`: Backend API URL
- `VITE_GOOGLE_MAPS_API_KEY`: Google Maps API key
- `NETLIFY_AUTH_TOKEN`: Netlify authentication token
- `NETLIFY_SITE_ID`: Netlify site identifier
- `FRONTEND_URL`: Production frontend URL

#### Backend Deployment:
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `ELEVENLABS_API_KEY`: Eleven Labs TTS API key
- `DEEPGRAM_API_KEY`: Deepgram voice agent API key
- `TWILIO_ACCOUNT_SID`: Twilio account identifier
- `TWILIO_AUTH_TOKEN`: Twilio authentication token
- `TWILIO_PHONE_NUMBER`: Twilio phone number
- `ANTHROPIC_API_KEY`: Claude AI API key
- `OPENROUTER_API_KEY`: OpenRouter API key
- `HUGGINGFACE_TOKEN`: HuggingFace API token
- `FACEBOOK_PAGE_ACCESS_TOKEN`: Facebook/Instagram API token
- `INSTAGRAM_PAGE_ID`: Instagram page identifier
- `RENDER_API_KEY`: Render deployment API key
- `RENDER_SERVICE_ID`: Render service identifier

#### Optional Secrets:
- `SLACK_WEBHOOK`: Slack notification webhook
- `CODECOV_TOKEN`: Code coverage reporting

## Configuration Files

### `.github/labeler.yml`
Configures automatic PR labeling based on file changes:
- frontend, backend, documentation, database
- voice-ai, instagram, phone-system
- dependencies, security, tests, subdomains

### `.github/dependabot.yml`
Manages automated dependency updates:
- Weekly schedule for npm packages
- Grouped updates for related packages
- Separate configurations for frontend/backend

## Usage Guidelines

### Manual Deployment
```bash
# Trigger deployment via GitHub UI:
# Actions → Deploy to Production → Run workflow

# Options:
# - Deploy backend: true/false
# - Deploy frontend: true/false
# - Run migrations: true/false
```

### Skip CI
Add `[skip ci]` to commit message to skip CI checks:
```bash
git commit -m "docs: Update README [skip ci]"
```

### Environment-Specific Deployments
The pipeline automatically detects changes:
- Frontend changes → Deploys only frontend
- Backend changes → Deploys only backend
- Migration changes → Runs migrations before deployment

### Preview Deployments
PRs with `frontend` or `preview` labels automatically get Netlify preview URLs.

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check Node.js version (requires 18.x)
   - Verify environment variables are set
   - Use `--legacy-peer-deps` for frontend

2. **Deployment Failures**
   - Verify API keys are valid
   - Check service quotas (Render, Netlify)
   - Review deployment logs

3. **Test Failures**
   - Currently, test scripts are optional
   - Add test scripts to package.json when ready

4. **Security Scan Failures**
   - High/critical vulnerabilities block deployment
   - Run `npm audit fix` locally
   - Update dependencies via Dependabot PRs

## Best Practices

1. **Commit Messages**: Use conventional commits
   - `feat:` New features
   - `fix:` Bug fixes
   - `docs:` Documentation
   - `chore:` Maintenance

2. **PR Guidelines**:
   - Keep PRs small and focused
   - Update documentation for API changes
   - Wait for all checks to pass

3. **Security**:
   - Never commit secrets or API keys
   - Review security scan results
   - Keep dependencies updated

4. **Performance**:
   - Monitor bundle size in PRs
   - Check Lighthouse scores regularly
   - Optimize images and assets