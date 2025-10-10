# 🚀 Quick Start: Deploy to AWS Amplify

This is the **fastest** way to get your ChatKit app running on AWS.

## 📋 What You Need (5 minutes)

Before starting, gather these from OpenAI:

1. **Workflow ID**: 
   - Go to https://platform.openai.com/agent-builder
   - Copy your workflow ID

2. **API Key**: 
   - Go to https://platform.openai.com/api-keys
   - Create new key (use project-scoped: `sk-proj-...`)
   - ⚠️ **Copy it now** - you won't see it again!

3. **(Optional) Organization ID & Project ID**:
   - Find in https://platform.openai.com/settings

## 🎯 Deploy Now (10 minutes)

### Step 1: Open AWS Amplify Console

Click here: [Open AWS Amplify Console →](https://console.aws.amazon.com/amplify/)

Or manually:
1. Go to AWS Console
2. Search for "Amplify" in the search bar
3. Click "AWS Amplify"

### Step 2: Create New App

1. Click the orange **"New app"** button
2. Select **"Host web app"**
3. Choose **"GitHub"** as your source
4. Click **"Authorize AWS Amplify"** (first time only)

### Step 3: Select Your Repository

1. **Repository**: Choose `emanom/openai-chatkit-starter-app`
2. **Branch**: Select `main`
3. Click **"Next"**

### Step 4: Configure Your App

AWS will auto-detect Next.js and show build settings. Just:

1. **App name**: Enter something like `chatkit-app` or `my-ai-assistant`
2. Click **"Advanced settings"** or scroll down to see **"Environment variables"**

### Step 5: Add Environment Variables 🔑

This is the **most important step**! Click "Add environment variable" and add:

| Key | Value | Secret? |
|-----|-------|---------|
| `OPENAI_API_KEY` | Your API key (sk-proj-...) | ✅ Check "Secret" |
| `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` | Your workflow ID | ❌ Leave unchecked |

**Optional but recommended:**
| Key | Value | Secret? |
|-----|-------|---------|
| `OPENAI_ORG_ID` | Your org ID (org-...) | ✅ Check "Secret" |
| `OPENAI_PROJECT_ID` | Your project ID (proj_...) | ✅ Check "Secret" |

**⚠️ Important**: Make sure to check the "Secret" checkbox for API keys!

### Step 6: Deploy! 🚀

1. Click **"Save and deploy"**
2. Wait 3-5 minutes while AWS builds your app
3. You'll see a progress bar with these stages:
   - Provision
   - Build
   - Deploy
   - Verify

### Step 7: Test Your App ✅

When the build completes (green checkmark):

1. Click on the **app URL** (looks like: `https://main.d123abc.amplifyapp.com`)
2. You should see your ChatKit interface
3. Try sending a message!

## 🎉 You're Done!

Your app is now live on AWS!

## 📱 What You Get

- ✅ **Live URL**: Share `https://main.d123abc.amplifyapp.com` with anyone
- ✅ **Auto-deploys**: Every git push automatically updates your app
- ✅ **HTTPS**: Secure by default
- ✅ **Free Tier**: AWS Amplify includes free tier (1000 build minutes/month)

## 🔧 Common Issues & Fixes

### ❌ Build Failed: "Missing OPENAI_API_KEY"
**Fix**: Go back to Amplify Console → Environment variables → Add the missing key

### ❌ Chat doesn't work: "Failed to create session"
**Fix**: Verify your API key is from the **same organization and project** as your workflow

### ❌ "Workflow not found"
**Fix**: Double-check your `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` is correct

### ❌ Can't authorize GitHub
**Fix**: Make sure you're logged into GitHub in the same browser

## 🎨 Next Steps

### Customize Your App

1. **Edit starter prompts**: 
   - Open `lib/config.ts`
   - Change `STARTER_PROMPTS` array

2. **Change greeting**: 
   - Open `lib/config.ts`
   - Update `GREETING` constant

3. **Add your branding**: 
   - Open `components/ChatKitPanel.tsx`
   - Customize theme and styling

### Add Custom Domain

1. In Amplify Console, go to **"App settings"** → **"Domain management"**
2. Click **"Add domain"**
3. Follow the wizard to configure your domain
4. Update DNS records (Amplify will guide you)

### Set Up Staging Environment

1. Create a `dev` branch in GitHub
2. In Amplify Console, click **"Connect branch"**
3. Select `dev` branch
4. Now you have separate staging and production environments!

## 📊 Monitor Your App

### View Logs
1. Go to Amplify Console
2. Click on your app
3. Click **"Build logs"** to see build history
4. Click **"Monitoring"** to see usage stats

### CloudWatch Logs
For runtime logs:
1. Go to CloudWatch in AWS Console
2. Find your app's log group
3. View real-time application logs

## 💰 Cost Estimate

**AWS Amplify Free Tier (first 12 months):**
- 1,000 build minutes/month (free)
- 15 GB data served/month (free)
- Typically **$0-5/month** for small apps

**After Free Tier:**
- ~$0.01/build minute
- ~$0.15/GB served
- Estimated **$5-20/month** for moderate traffic

**OpenAI Costs:**
- Depends on your workflow usage
- Monitor in OpenAI Dashboard

## 🆘 Need Help?

- 📖 [Full Deployment Guide](./AWS_DEPLOYMENT_GUIDE.md)
- ✅ [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- 🌐 [OpenAI ChatKit Docs](https://platform.openai.com/docs/guides/chatkit)
- ☁️ [AWS Amplify Docs](https://docs.amplify.aws/)

## 🔄 Update Your App

After deploying, when you want to make changes:

```bash
# 1. Make your changes locally
# 2. Test with: npm run dev
# 3. Commit and push:
git add .
git commit -m "Update my app"
git push origin main

# 4. Amplify will automatically rebuild and deploy! ✨
```

---

**Pro Tip**: Bookmark your Amplify app dashboard for easy access to logs and settings!

