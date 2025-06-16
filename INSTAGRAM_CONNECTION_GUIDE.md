# 📱 Instagram Connection Guide - Bowery Creative

## Quick Setup (10 minutes)

### Step 1: Create Facebook Page (2 min)
1. Go to: https://business.facebook.com/
2. Click **"Create"** → **"Page"**
3. **Page name**: "Dr. [Name] Dental - Managed by Bowery Creative"
4. **Category**: Dentist & Dental Office
5. **Skip** all optional steps for now

### Step 2: Add Page to Your Business Manager (1 min)
1. **Business Settings** → **Pages** → **Add** → **Claim a Page**
2. Enter the page name you just created
3. Confirm you're the admin

### Step 3: Connect Doctor's Instagram (5 min)

**On YOUR device (important for security):**

1. **Open Instagram app** (or instagram.com)
2. **Login** with doctor's credentials
3. **Go to Settings** → **Account**
4. **Switch to Professional Account** → **Business**
5. **Select Category**: Dentist
6. **Connect Facebook Page**: Choose the page you created
7. **Skip** all optional steps

### Step 4: Secure the Account (2 min)

**Add YOUR security info:**

1. **Settings** → **Security** → **Two-Factor Authentication**
   - Turn ON
   - Use YOUR phone number: [Your Phone]
   - Save backup codes in 1Password

2. **Settings** → **Security** → **Emails from Instagram**
   - Add YOUR email: jason+[clientname]@bowerycreative.com

3. **Settings** → **Account** → **Personal Information**
   - Update email to: jason+[clientname]@bowerycreative.com
   - Keep doctor's phone number

### Step 5: Get Page Access Token

1. **Go back to Facebook Messenger settings**
2. **Your newly connected page should appear**
3. **Click "Generate Token"**
4. **Copy the long token** (starts with EAA...)
5. **Save in 1Password** as "[Client] Page Access Token"

### Step 6: Complete Webhook Setup

Now you can:
1. **Subscribe the page** to your webhook
2. **Select fields**: messages, messaging_postbacks, message_deliveries
3. **Save**

### Step 7: Add to Render Environment

In your Render service, add:
```
FACEBOOK_PAGE_ACCESS_TOKEN=[The token you copied]
INSTAGRAM_PAGE_ID=[Will auto-populate from token]
```

## 🔒 Security Checklist

- [ ] Instagram 2FA enabled with YOUR phone
- [ ] Backup codes saved in 1Password
- [ ] Recovery email is yours
- [ ] Facebook page admin is you
- [ ] Doctor is only Editor on FB page
- [ ] All passwords in 1Password

## 🚨 Common Issues

### "Can't connect Instagram to Page"
- Make sure Instagram is Business/Creator account
- Check that you're admin of the Facebook page
- Try disconnecting and reconnecting

### "Webhook won't verify"
- Check Render logs for errors
- Ensure verify token matches exactly
- Try the test curl command first

### "Can't generate Page Access Token"
- Make sure page is connected to Instagram
- Check you have proper admin permissions
- Try in an incognito window

## 📞 Need Help?

- **Render Logs**: Check for webhook errors
- **Facebook Support**: business.facebook.com/help
- **Test Webhook**: 
  ```bash
  curl "https://pedrobackend.onrender.com/api/instagram/webhook?hub.mode=subscribe&hub.verify_token=pedro_dental_2025&hub.challenge=test"
  ```

---

**Pro Tip**: Do all of this on YOUR computer/phone, not the client's device. This ensures you maintain control and can help if they get locked out.