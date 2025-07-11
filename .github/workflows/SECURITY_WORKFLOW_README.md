# Security Workflow Configuration

This document explains the security scanning workflow configuration for the Dr. Pedro dental practice application.

## Overview

The security workflow (`security.yml`) runs comprehensive security checks on the codebase, including:
- CodeQL analysis for code vulnerabilities
- Dependency vulnerability scanning
- Secret scanning to prevent credential leaks
- OWASP dependency checks
- Security headers validation
- API security testing

## Workflow Jobs

### 1. CodeQL Analysis
- Scans JavaScript and TypeScript code for security vulnerabilities
- Uses GitHub's CodeQL engine with security-and-quality queries
- Critical for identifying code-level security issues

### 2. Dependency Vulnerability Scan
- Runs `npm audit` on the entire workspace
- Identifies vulnerabilities in npm packages
- Reports high and critical severity issues

### 3. Secret Scanning
- **TruffleHog**: Scans for verified secrets in git history
- **Gitleaks**: Uses custom configuration (`.gitleaks.toml`) to prevent false positives
- Both tools run with `continue-on-error` to prevent blocking on false positives

### 4. OWASP Dependency Check
- Comprehensive dependency vulnerability analysis
- Scans `package-lock.json` and individual `package.json` files
- Generates HTML report for detailed review
- Fails on CVSS score >= 7 (high severity)

### 5. Security Headers Check
- Validates security headers on production URLs
- Requires `FRONTEND_URL` and `VITE_BACKEND_URL` secrets
- Checks for: X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security, CSP

### 6. API Security Testing
- Uses OWASP ZAP for API vulnerability scanning
- Configured via `.zap/rules.tsv` for API-specific rules
- Requires production backend URL to be set

## Required Configuration

### GitHub Secrets
For full functionality, configure these secrets:
- `FRONTEND_URL`: Production frontend URL (e.g., https://drpedro.netlify.app)
- `VITE_BACKEND_URL`: Production backend URL (e.g., https://pedro-backend.onrender.com)

### Files Created
1. **`.gitleaks.toml`**: Custom configuration to reduce false positives
   - Ignores node_modules, build directories
   - Allows public keys like VITE_SUPABASE_ANON_KEY
   - Configured for React/Node.js projects

2. **`.zap/rules.tsv`**: OWASP ZAP rules for API scanning
   - Disables HTML-specific rules for API endpoints
   - Keeps critical security checks active
   - Customized for REST API security

## Handling Failures

The workflow is designed to be informative rather than blocking:

### Critical Checks (Will fail the workflow)
- CodeQL Analysis failures
- Dependency Scan with high/critical vulnerabilities

### Non-Critical Checks (Warnings only)
- Secret scanning (uses continue-on-error)
- OWASP checks (uses continue-on-error)
- Security headers (skipped if URLs not configured)
- API security (skipped if URL not configured)

## Running Locally

To run security checks locally:

```bash
# Dependency audit
npm audit

# Secret scanning
npx gitleaks detect --config .gitleaks.toml

# Generate OWASP report (requires Java)
dependency-check --project "pedro-dental" --scan package-lock.json
```

## Workspace Structure

This project uses npm workspaces with:
- Root `package-lock.json` contains all dependencies
- Individual workspaces: `frontend/` and `backend/`
- Security scans run on the entire workspace

## Best Practices

1. **Regular Updates**: Run `npm update` regularly to get security patches
2. **Review Reports**: Check uploaded artifacts for detailed vulnerability info
3. **Fix Critical Issues**: Address high/critical vulnerabilities immediately
4. **Configure Secrets**: Set production URLs for complete security validation
5. **Monitor Warnings**: Even non-failing checks provide valuable security insights

## Troubleshooting

### "package-lock.json not found"
- Run `npm install --legacy-peer-deps` at the root
- The project uses workspaces, so package-lock.json is at the root

### Secret scanning false positives
- Update `.gitleaks.toml` with additional patterns
- Use inline comments: `# gitleaks:allow`

### API security scan failures
- Ensure `.zap/rules.tsv` exists
- Set `VITE_BACKEND_URL` secret in GitHub
- Review API-specific security requirements

### Security headers missing
- Configure production URLs in GitHub secrets
- Implement headers in backend middleware (Helmet.js)
- Configure headers in frontend hosting (Netlify/Vercel)