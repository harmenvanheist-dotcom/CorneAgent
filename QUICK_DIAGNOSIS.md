# Quick Diagnosis - Fix Your Deployment Now! 🚀

## TL;DR - What's Wrong?

Your app is deployed to Cloud Run but **environment variables from `.env.local` are NOT loaded**. You need to set them in Cloud Run directly.

## 🔍 Run Diagnostics Right Now

### Option 1: In Your Browser (Easiest)
Visit this URL to see a visual diagnostic report:

**→ https://openai-chatkit-starter-app-211859674907.europe-west1.run.app/diagnose**

This will show you:
- ✅ What's configured correctly
- ❌ What's missing
- 📋 Step-by-step fix instructions

### Option 2: API Endpoint (For Scripts)
```bash
curl https://openai-chatkit-starter-app-211859674907.europe-west1.run.app/api/diagnose
```

### Option 3: Test Script (Most Comprehensive)
```bash
cd /home/agent/workspace/openai-chatkit-starter-app
./scripts/test-deployment.sh https://openai-chatkit-starter-app-211859674907.europe-west1.run.app
```

## 🛠️ How to Fix (2 Minutes)

### Step 1: Get Your Values

1. **OpenAI API Key**: Go to https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Copy the key (starts with `sk-`)

2. **Workflow ID**: Go to https://platform.openai.com/agent-builder
   - Open or create your workflow
   - Click "Publish"
   - Copy the Workflow ID (starts with `wf_`)

### Step 2: Set Environment Variables in Cloud Run

#### Using Google Cloud Console (Recommended):
1. Go to https://console.cloud.google.com/run
2. Click on `openai-chatkit-starter-app`
3. Click **"Edit & Deploy New Revision"**
4. Scroll to **"Variables & Secrets"**
5. Click **"Add Variable"** and add:
   ```
   Name: OPENAI_API_KEY
   Value: sk-your-actual-key-here
   ```
6. Click **"Add Variable"** again and add:
   ```
   Name: NEXT_PUBLIC_CHATKIT_WORKFLOW_ID
   Value: wf_your-actual-workflow-id
   ```
7. Click **"Deploy"**
8. Wait 1-2 minutes for deployment

#### Using Command Line:
```bash
gcloud run services update openai-chatkit-starter-app \
  --region=europe-west1 \
  --set-env-vars="OPENAI_API_KEY=sk-your-key,NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_your-workflow-id"
```

### Step 3: Verify It Works

1. Run diagnostics again:
   ```
   https://openai-chatkit-starter-app-211859674907.europe-west1.run.app/diagnose
   ```

2. You should see all ✅ green checkmarks

3. Test your app:
   ```
   https://openai-chatkit-starter-app-211859674907.europe-west1.run.app/
   ```

## 📊 What Each Tool Does

| Tool | Purpose | Access |
|------|---------|--------|
| **Diagnostic Page** | Visual report of all checks | `/diagnose` |
| **Diagnostic API** | JSON response for automation | `/api/diagnose` |
| **Test Script** | Comprehensive CLI testing | `./scripts/test-deployment.sh` |
| **Guide** | Detailed documentation | `DEPLOYMENT_DIAGNOSTICS.md` |

## 🚨 Common Issues & Fixes

### Issue 1: "Set NEXT_PUBLIC_CHATKIT_WORKFLOW_ID in your .env.local file"
**Fix:** Set `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` in Cloud Run environment variables (not in `.env.local`)

### Issue 2: 401 Unauthorized from OpenAI API
**Fix:** Set `OPENAI_API_KEY` in Cloud Run environment variables

### Issue 3: Workflow ID is set but still not working
**Fix:** Make sure the workflow ID doesn't start with `wf_replace` (it's a placeholder)

### Issue 4: Changed env vars but still seeing errors
**Fix:** You must **redeploy** after changing environment variables

## 📝 Example Environment Variables

Here's what your Cloud Run environment variables should look like:

```
OPENAI_API_KEY=sk-proj-abc123def456...
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_123abc456def
NODE_ENV=production
```

## ✅ Success Checklist

- [ ] I have my OpenAI API key (starts with `sk-`)
- [ ] I have my Workflow ID (starts with `wf_`)
- [ ] I set both env vars in Cloud Run (not just .env.local)
- [ ] I clicked "Deploy" to apply the changes
- [ ] I visited `/diagnose` and see green checkmarks
- [ ] My app loads without errors

## 🆘 Still Having Issues?

1. Visit the diagnostic page: `/diagnose`
2. Take a screenshot of the results
3. Check Cloud Run logs:
   ```bash
   gcloud run services logs read openai-chatkit-starter-app --region=europe-west1 --limit=50
   ```
4. Read the full guide: `DEPLOYMENT_DIAGNOSTICS.md`

## 📚 Files Created

All diagnostic tools are now in your repo:

```
openai-chatkit-starter-app/
├── app/
│   ├── api/
│   │   └── diagnose/
│   │       └── route.ts          # Server-side diagnostic API
│   └── diagnose/
│       └── page.tsx               # Client-side diagnostic page
├── scripts/
│   └── test-deployment.sh         # Automated test script
├── DEPLOYMENT_DIAGNOSTICS.md      # Detailed guide
├── QUICK_DIAGNOSIS.md            # This file
└── env.example                    # Example environment variables
```

---

**Need immediate help?** Run this now:
```bash
./scripts/test-deployment.sh https://openai-chatkit-starter-app-211859674907.europe-west1.run.app
```

