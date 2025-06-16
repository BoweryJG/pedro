# Bowery Creative - Client Instagram Automation Setup

## Client Information Template

### Client: Dr. [Name]
- **Service Start Date**: June 16, 2025
- **Monthly Fee**: $997
- **Contract Term**: 12 months

### Facebook Page
- **Page Name**: Dr. [Name] Dental - Managed by Bowery Creative
- **Page ID**: [FACEBOOK_PAGE_ID]
- **Page Admin**: jason@bowerycreative.com
- **Client Role**: Editor

### Instagram Account
- **Username**: @dr[name]dental
- **Account Type**: Business
- **Connected FB Page**: Dr. [Name] Dental - Managed by Bowery Creative
- **2FA Phone**: Jason's Phone (xxx-xxx-xxxx)
- **Recovery Email**: jason+dr[name]@bowerycreative.com

### Technical Configuration
- **Deployment URL**: https://dr[name]backend.onrender.com
- **Dashboard URL**: https://dr[name]dental.netlify.app/instagram-dashboard
- **Webhook Endpoint**: https://dr[name]backend.onrender.com/api/instagram/webhook

### Access Credentials (Store in 1Password)
```
Instagram Login:
- Username: @dr[name]dental
- Password: [SECURE_PASSWORD]
- 2FA Backup Codes: [STORE_IN_1PASSWORD]

Facebook Page Access:
- Page Access Token: [LONG_LIVED_TOKEN]
- Token Expiry: [DATE + 60 DAYS]
- Refresh Schedule: Monthly

API Keys:
- Anthropic API Key: [CLAUDE_API_KEY]
- Supabase URL: [PROJECT_URL]
- Supabase Service Key: [SERVICE_KEY]
```

### Monthly Maintenance Checklist
- [ ] Verify Instagram 2FA still active
- [ ] Check Page Access Token expiry
- [ ] Review conversation analytics
- [ ] Audit AI response quality
- [ ] Update client on performance
- [ ] Refresh tokens if needed

### Emergency Contacts
- **Client Phone**: [PHONE]
- **Client Email**: [EMAIL]
- **Alternate Contact**: [OFFICE_MANAGER]

## Deployment Instructions

1. **Clone Configuration**
   ```bash
   # Copy from template
   cp backend/.env.example backend/.env.dr[name]
   ```

2. **Set Environment Variables in Render**
   ```
   FACEBOOK_APP_ID=959139930338809
   FACEBOOK_APP_SECRET=[YOUR_APP_SECRET]
   FACEBOOK_PAGE_ACCESS_TOKEN=[GENERATED_TOKEN]
   FACEBOOK_WEBHOOK_VERIFY_TOKEN=dr[name]_dental_2025
   INSTAGRAM_PAGE_ID=[FROM_GRAPH_API]
   ANTHROPIC_API_KEY=[YOUR_CLAUDE_KEY]
   SUPABASE_URL=[YOUR_SUPABASE_URL]
   SUPABASE_SERVICE_ROLE_KEY=[YOUR_SUPABASE_KEY]
   PRACTICE_NAME="Dr. [Name] Dental"
   PRACTICE_PHONE="(xxx) xxx-xxxx"
   PRACTICE_EMAIL="info@dr[name]dental.com"
   ```

3. **Test Webhook**
   ```bash
   curl -X GET "https://dr[name]backend.onrender.com/api/instagram/webhook?hub.verify_token=dr[name]_dental_2025&hub.challenge=test123&hub.mode=subscribe"
   ```

## Billing & Invoicing

### Monthly Invoice Items:
- Instagram DM Automation Service: $997
- AI Response Processing: Included
- Dashboard Access: Included
- Monthly Analytics Report: Included
- 24/7 Monitoring: Included

### Additional Services:
- Custom AI Training: $500/session
- Additional Social Platforms: $297/platform
- API Overage (>10K messages): $0.10/message

## Legal Documentation

### Required Agreements:
1. **Social Media Management Agreement** - Signed [DATE]
2. **HIPAA Business Associate Agreement** - Signed [DATE]
3. **Data Processing Agreement** - Signed [DATE]

### Liability Coverage:
- Professional Liability Insurance: Active
- Cyber Insurance: Active
- Errors & Omissions: Active

---

**Internal Notes**:
- Client onboarded by: Jason
- Technical setup by: Jason + Claude
- Primary contact: Office Manager
- Preferred contact time: Mornings