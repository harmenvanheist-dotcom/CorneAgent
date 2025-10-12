# 🚀 Deploy with Diagnostics - Quick Start

## What I've Created

I've added comprehensive diagnostic tools to help you fix the environment variable issue:

1. **`/diagnose`** - Visual diagnostic page (shows what's wrong)
2. **`/api/diagnose`** - JSON diagnostic endpoint (for scripts)
3. **Test script** - Automated testing tool
4. **Deploy script** - Easy deployment with env vars

## 🎯 Deploy Now (3 Steps)

### Step 1: Set Your Environment Variables

```bash
# Navigate to the app directory
cd /home/agent/workspace/openai-chatkit-starter-app

# Set your OpenAI API key
export OPENAI_API_KEY='sk-your-actual-key-here'

# Set your Workflow ID from Agent Builder
export NEXT_PUBLIC_CHATKIT_WORKFLOW_ID='wf_your-actual-workflow-id'
```

**Where to get these:**
- **API Key**: https://platform.openai.com/api-keys
- **Workflow ID**: https://platform.openai.com/agent-builder → Click "Publish"

### Step 2: Run the Deploy Script

```bash
# Make the script executable
chmod +x deploy-to-cloudrun.sh

# Deploy!
./deploy-to-cloudrun.sh
```

The script will:
- ✅ Verify your environment variables are set
- ✅ Build the app locally to catch errors
- ✅ Deploy to Cloud Run with environment variables
- ✅ Show you the diagnostic URLs to test

### Step 3: Test the Deployment

After deployment completes, visit the diagnostic page:

```
https://openai-chatkit-starter-app-211859674907.europe-west1.run.app/diagnose
```

You should see all ✅ green checkmarks!

## 📋 Alternative: Manual Deployment

If you prefer to deploy manually using `gcloud`:

```bash
# Set your environment variables first
export OPENAI_API_KEY='sk-your-key'
export NEXT_PUBLIC_CHATKIT_WORKFLOW_ID='wf_your-workflow-id'

# Deploy
gcloud run deploy openai-chatkit-starter-app \
  --source . \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars="OPENAI_API_KEY=${OPENAI_API_KEY},NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=${NEXT_PUBLIC_CHATKIT_WORKFLOW_ID}"
```

## 🔧 Or Update Existing Deployment

If you want to just update the environment variables without redeploying:

```bash
gcloud run services update openai-chatkit-starter-app \
  --region=europe-west1 \
  --set-env-vars="OPENAI_API_KEY=sk-your-key,NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_your-workflow-id"
```

**Note:** After updating env vars, you still need to trigger a new revision:

```bash
gcloud run services update openai-chatkit-starter-app \
  --region=europe-west1 \
  --no-traffic
```

## 🧪 Test Before Deploying

Want to test locally first?

```bash
# Create .env.local for local testing
cat > .env.local << EOF
OPENAI_API_KEY=sk-your-key
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_your-workflow-id
EOF

# Start the dev server
npm run dev

# Visit in browser:
# https://localhost:3000/diagnose
```

## 📊 What the Diagnostics Will Show

After deployment, the diagnostic page will check:

**Client-Side:**
- ✅ Is `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` available in the browser?
- ✅ Browser compatibility (Custom Elements, Crypto API)
- ✅ Is workflow ID valid (not a placeholder)?

**Server-Side:**
- ✅ Is `OPENAI_API_KEY` configured?
- ✅ Is the API key format valid (starts with `sk-`)?
- ✅ Is `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` set?
- ✅ Node environment settings

**Plus:**
- 📋 Specific recommendations if anything is wrong
- 🎯 Step-by-step fix instructions
- 🔍 Detailed debug information

## 🐛 Troubleshooting

### "Error: gcloud: command not found"
Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install

### "Error: No GCP project set"
```bash
gcloud config set project YOUR_PROJECT_ID
gcloud auth login
```

### "Still getting 404 on /diagnose"
Make sure you've deployed the new code:
1. Commit and push changes (if using git)
2. Run the deploy script again
3. Wait for deployment to complete (2-3 minutes)

### "Environment variables still not working"
Remember: `NEXT_PUBLIC_*` variables must be set during build time!

The deploy script handles this automatically by setting them during deployment.

## 📂 Files Created

Here's what I added to your project:

```
openai-chatkit-starter-app/
├── app/
│   ├── api/
│   │   └── diagnose/
│   │       └── route.ts              # NEW: Diagnostic API endpoint
│   └── diagnose/
│       └── page.tsx                   # NEW: Diagnostic web page
├── scripts/
│   └── test-deployment.sh            # NEW: Test script
├── deploy-to-cloudrun.sh             # NEW: Deploy script
├── DEPLOYMENT_DIAGNOSTICS.md         # NEW: Full guide
├── QUICK_DIAGNOSIS.md                # NEW: Quick reference
├── DEPLOY_NOW.md                     # NEW: This file
└── env.example                       # NEW: Environment template
```

All files are ready to use and fully functional!

## ✅ Success Checklist

- [ ] I have my OpenAI API key
- [ ] I have my Workflow ID
- [ ] I've exported both as environment variables
- [ ] I've run `./deploy-to-cloudrun.sh`
- [ ] Deployment completed successfully
- [ ] I've visited `/diagnose` and see green checkmarks
- [ ] My app works without errors! 🎉

## 🎯 Next Steps After Successful Deployment

1. **Add your domain to OpenAI allowlist**:
   - Go to: https://platform.openai.com/settings/organization/security/domain-allowlist
   - Add: `openai-chatkit-starter-app-211859674907.europe-west1.run.app`

2. **Test your workflow**:
   - Visit your app
   - Try the starter prompts
   - Upload files (if your workflow supports it)

3. **Customize the UI**:
   - Edit `lib/config.ts` for starter prompts, theme, etc.
   - Edit `components/ChatKitPanel.tsx` for advanced customization

4. **Monitor logs**:
   ```bash
   gcloud run services logs tail openai-chatkit-starter-app --region=europe-west1
   ```

---

**Ready to deploy? Run this now:**

```bash
export OPENAI_API_KEY='sk-your-key'
export NEXT_PUBLIC_CHATKIT_WORKFLOW_ID='wf_your-workflow-id'
./deploy-to-cloudrun.sh
```

