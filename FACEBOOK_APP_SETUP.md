# Facebook App Configuration for Instagram DM Automation

## 🚀 Your Current App: "Robotic Ai" (ID: 959139930338809)

### Step 1: Add Messenger Product

1. **Go to your app dashboard**: https://developers.facebook.com/apps/959139930338809/
2. **Click "Add Product"** (you should see it in the left sidebar)
3. **Find "Messenger"** in the product list
4. **Click "Set up"** on Messenger

### Step 2: Configure Instagram Settings

Since you already have Instagram product added:

1. **Click "Instagram" in left sidebar**
2. **Go to "Settings"**
3. **Add these permissions** (if not already added):
   - `instagram_basic`
   - `instagram_manage_messages` (requires business verification)
   - `pages_messaging`
   - `pages_read_engagement`

### Step 3: Get Your Credentials

**App Secret:**
1. Go to **Settings → Basic**
2. Click **Show** next to "App Secret"
3. Copy the secret: `[COPY THIS VALUE]`

**Page Access Token:**
1. Go to **Messenger → Settings**
2. In "Access Tokens" section
3. Select your Instagram-connected Facebook Page
4. Click **Generate Token**
5. Copy the token: `[COPY THIS LONG TOKEN]`

**Instagram Business Account ID:**
We'll get this programmatically once the webhook is set up.

### Step 4: Set Up Webhook

1. **Go to Messenger → Settings**
2. **In "Webhooks" section, click "Add Callback URL"**
3. **Callback URL**: `https://pedrobackend.onrender.com/api/instagram/webhook`
4. **Verify Token**: `pedro_dental_2025`
5. **Subscribe to these fields**:
   - `messages`
   - `messaging_postbacks`
   - `message_deliveries`

### Step 5: Instagram-Specific Configuration

1. **Go to Instagram → Settings**
2. **Add Instagram Account**: Connect your business Instagram
3. **Webhook Configuration**: Same webhook URL as above
4. **Subscribe to**: `messages` field

## 🔑 Environment Variables Needed

Once you complete the above steps, you'll have these values:

```env
FACEBOOK_APP_SECRET=[from Step 3]
FACEBOOK_PAGE_ACCESS_TOKEN=[from Step 3]
FACEBOOK_WEBHOOK_VERIFY_TOKEN=pedro_dental_2025
INSTAGRAM_PAGE_ID=[we'll get this via API]
```

## ⚠️ Important Notes

- **Business Verification**: Your app may need business verification for `instagram_manage_messages`
- **App Review**: Some permissions require Facebook app review
- **Live Mode**: Switch from Development to Live mode when ready for production

Next: Deploy the backend and test the webhook!