# 🔍 Diagnostic Tools - Complete Summary

## Problem Solved

You were getting this error:
```
POST https://api.openai.com/v1/chatkit/domain_keys/verify_hosted 401 (Unauthorized)
Message: "Set NEXT_PUBLIC_CHATKIT_WORKFLOW_ID in your .env.local file."
```

**Root Cause:** Environment variables from `.env.local` are not loaded in Cloud Run deployments. They must be set in the Cloud Run service configuration.

## ✨ What I've Created

### 1. 🌐 Web-Based Diagnostic Page
**Path:** `/diagnose`  
**File:** `app/diagnose/page.tsx`

**Features:**
- Visual dashboard with color-coded status (✅ ⚠️ ❌)
- Client-side checks (browser, env vars)
- Server-side checks (API key, workflow ID)
- Specific recommendations
- Cloud Run deployment instructions

**Usage:**
```
https://your-app.run.app/diagnose
```

### 2. 🔌 Diagnostic API Endpoint
**Path:** `/api/diagnose`  
**File:** `app/api/diagnose/route.ts`

**Features:**
- JSON response with all checks
- Security-safe (shows prefixes, not full values)
- Suitable for automation/CI/CD
- Lists all relevant environment variables

**Usage:**
```bash
curl https://your-app.run.app/api/diagnose | jq .
```

### 3. 🧪 Test Script
**Path:** `scripts/test-deployment.sh`

**Features:**
- Automated testing of deployment
- Color-coded terminal output
- Checks app reachability
- Tests diagnostic endpoints
- Validates session creation
- Provides actionable recommendations

**Usage:**
```bash
./scripts/test-deployment.sh https://your-app.run.app
```

### 4. 🚀 Deploy Script
**Path:** `deploy-to-cloudrun.sh`

**Features:**
- Validates environment variables before deploying
- Builds locally to catch errors
- Deploys with correct env vars
- Shows diagnostic URLs after deployment
- Color-coded output

**Usage:**
```bash
export OPENAI_API_KEY='sk-...'
export NEXT_PUBLIC_CHATKIT_WORKFLOW_ID='wf_...'
./deploy-to-cloudrun.sh
```

### 5. 📚 Documentation

| File | Purpose |
|------|---------|
| `DEPLOY_NOW.md` | Quick start deployment guide (START HERE) |
| `DEPLOYMENT_DIAGNOSTICS.md` | Comprehensive troubleshooting guide |
| `QUICK_DIAGNOSIS.md` | Quick reference and fixes |
| `DIAGNOSTIC_TOOLS_SUMMARY.md` | This file - overview of all tools |
| `env.example` | Template for environment variables |

## 🎯 Quick Start (3 Commands)

```bash
# 1. Set environment variables
export OPENAI_API_KEY='sk-your-key-here'
export NEXT_PUBLIC_CHATKIT_WORKFLOW_ID='wf_your-workflow-id'

# 2. Deploy
./deploy-to-cloudrun.sh

# 3. Visit diagnostic page (shown after deployment)
https://openai-chatkit-starter-app-211859674907.europe-west1.run.app/diagnose
```

## 📊 What Each Tool Checks

### Client-Side Checks
- ✅ `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` accessible in browser
- ✅ Workflow ID is not a placeholder (`wf_replace...`)
- ✅ Browser supports Custom Elements (required for ChatKit)
- ✅ Crypto API available (for secure session IDs)
- ✅ JavaScript execution working correctly

### Server-Side Checks
- ✅ `OPENAI_API_KEY` is set
- ✅ API key has correct format (starts with `sk-`)
- ✅ API key has reasonable length
- ✅ `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` is set
- ✅ `CHATKIT_WORKFLOW_ID` is set (optional, for file uploads)
- ✅ Node environment configured correctly
- ✅ Lists all relevant environment variables (keys only)

## 🛠️ Deployment Options

### Option 1: Automated Script (Recommended)
```bash
./deploy-to-cloudrun.sh
```

### Option 2: Manual gcloud Command
```bash
gcloud run deploy openai-chatkit-starter-app \
  --source . \
  --region europe-west1 \
  --set-env-vars="OPENAI_API_KEY=sk-...,NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_..."
```

### Option 3: Google Cloud Console
1. Go to Cloud Console
2. Edit service
3. Add environment variables
4. Deploy new revision

## 🔄 Deployment Workflow

```
┌─────────────────────────────────────────────────────────┐
│  1. Set Environment Variables Locally                   │
│     export OPENAI_API_KEY='sk-...'                      │
│     export NEXT_PUBLIC_CHATKIT_WORKFLOW_ID='wf_...'    │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│  2. Run Deploy Script                                   │
│     ./deploy-to-cloudrun.sh                             │
│     • Validates env vars                                │
│     • Builds locally                                    │
│     • Deploys to Cloud Run                              │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│  3. Cloud Run Builds App                                │
│     • Installs dependencies                             │
│     • Runs `npm run build`                              │
│     • NEXT_PUBLIC_* vars embedded in JS bundle          │
│     • Creates container image                           │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│  4. Test Deployment                                     │
│     Visit: /diagnose                                    │
│     • See all checks                                    │
│     • Get recommendations                               │
│     • Verify everything is ✅                           │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│  5. Use Your App!                                       │
│     Visit: /                                            │
│     • ChatKit loads correctly                           │
│     • No 401 errors                                     │
│     • Workflow connects successfully                    │
└─────────────────────────────────────────────────────────┘
```

## 🆘 Troubleshooting Guide

### Issue: 404 on /diagnose
**Solution:** The new code isn't deployed yet. Run `./deploy-to-cloudrun.sh`

### Issue: Still showing "Set NEXT_PUBLIC_CHATKIT_WORKFLOW_ID"
**Solution:** Environment variable not set correctly. Check:
1. Did you set it before deploying?
2. Did you redeploy after setting it?
3. Visit `/diagnose` to see exact status

### Issue: 401 Unauthorized
**Solution:** 
1. Check `OPENAI_API_KEY` is set correctly
2. Ensure API key is from same org/project as Agent Builder
3. Visit `/api/diagnose` to verify server has the key

### Issue: Workflow ID is "wf_replace..."
**Solution:** You're using the placeholder. Get real ID from Agent Builder:
1. Go to https://platform.openai.com/agent-builder
2. Click "Publish" on your workflow
3. Copy the actual workflow ID
4. Redeploy with correct ID

## 📱 Testing Checklist

After deployment, verify:

- [ ] App is reachable (no 5xx errors)
- [ ] Visit `/diagnose` - page loads
- [ ] All client checks show ✅
- [ ] All server checks show ✅
- [ ] No "Set NEXT_PUBLIC_CHATKIT_WORKFLOW_ID" error
- [ ] Visit `/` - app loads
- [ ] ChatKit component appears
- [ ] No 401 errors in browser console
- [ ] Can send test messages

## 🎓 Understanding NEXT_PUBLIC_ Variables

**Important:** `NEXT_PUBLIC_*` environment variables are special in Next.js:

1. **Build Time:** Embedded into JavaScript bundle during `npm run build`
2. **Client Access:** Available in browser via `process.env.NEXT_PUBLIC_*`
3. **Deployment:** Must be set BEFORE or DURING build, not just at runtime

**This is why:**
- Setting them in Cloud Run env vars works (applied during build)
- Setting them in `.env.local` locally works (used by `npm run dev`)
- Setting them only at runtime (after build) doesn't work for client code

**The deploy script handles this correctly by:**
```bash
--set-env-vars="NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_..."
# ↑ This sets it during Cloud Run's build process
```

## 📈 Success Metrics

After successful deployment, you should see:

```
✅ App Status: HEALTHY
✅ Client Checks: 4/4 passed
✅ Server Checks: 6/6 passed
✅ Recommendations: "All checks passed!"
✅ Browser Console: No errors
✅ Workflow: Connected and responding
```

## 🔐 Security Notes

1. **Never commit** `.env.local` or any file with secrets to Git
2. **Use Secret Manager** for production:
   ```bash
   gcloud secrets create openai-api-key --data-file=-
   # Then reference in Cloud Run
   ```
3. **Diagnostic endpoints** don't expose full API keys (only prefixes)
4. **API keys** are server-side only (not sent to browser)
5. **Workflow IDs** are public (embedded in client code)

## 📞 Getting Help

1. **Run diagnostics first:**
   ```bash
   curl https://your-app.run.app/api/diagnose
   ```

2. **Check Cloud Run logs:**
   ```bash
   gcloud run services logs tail openai-chatkit-starter-app --region=europe-west1
   ```

3. **Use test script:**
   ```bash
   ./scripts/test-deployment.sh https://your-app.run.app
   ```

4. **Read documentation:**
   - Start with: `DEPLOY_NOW.md`
   - Detailed guide: `DEPLOYMENT_DIAGNOSTICS.md`
   - Quick reference: `QUICK_DIAGNOSIS.md`

## 🎉 Summary

I've created a complete diagnostic and deployment toolkit for your ChatKit app:

- ✅ **2 diagnostic endpoints** (web + API)
- ✅ **2 automation scripts** (deploy + test)
- ✅ **4 documentation files** (guides + references)
- ✅ **Fixed linting errors** in existing code
- ✅ **Built and verified** locally

**Next step:** Run `./deploy-to-cloudrun.sh` and visit `/diagnose`!

---

**Files to read in order:**
1. `DEPLOY_NOW.md` ← Start here
2. Visit `/diagnose` after deploying
3. `QUICK_DIAGNOSIS.md` for quick reference
4. `DEPLOYMENT_DIAGNOSTICS.md` for deep troubleshooting

