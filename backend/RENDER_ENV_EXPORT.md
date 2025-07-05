# Quick Way to Export All Render Environment Variables

## Option 1: Render Dashboard (Easiest)

1. Go to your Render dashboard
2. Open your backend service
3. Go to the "Environment" tab
4. Click the "..." menu in the top right of the environment variables section
5. Select "Download .env file"
6. Save it as `.env` in your backend folder

## Option 2: Use Render CLI

```bash
# Install Render CLI if you haven't
npm install -g @render-com/cli

# Login to Render
render login

# List your services to find the service ID
render services list

# Export env vars (replace srv-xxxxx with your service ID)
render env list --service srv-xxxxx > .env.from-render

# Then manually format it into .env format
```

## Option 3: Browser Console Trick

1. Open Render dashboard with your service's environment variables visible
2. Open browser developer console (F12)
3. Paste this code:

```javascript
// Run this in the browser console on the Render environment variables page
const vars = [];
document.querySelectorAll('[data-testid="env-var-row"]').forEach(row => {
  const key = row.querySelector('[data-testid="env-var-key"]')?.textContent;
  const value = row.querySelector('[data-testid="env-var-value"] input')?.value || 
                row.querySelector('[data-testid="env-var-value"]')?.textContent;
  if (key && value) {
    vars.push(`${key}=${value}`);
  }
});
console.log(vars.join('\n'));
copy(vars.join('\n')); // Copies to clipboard
console.log('Environment variables copied to clipboard!');
```

4. Paste the result into your `.env` file

## Security Note

After downloading, make sure to:
- Add `.env` to your `.gitignore` (should already be there)
- Never commit these files to git
- Keep sensitive keys secure