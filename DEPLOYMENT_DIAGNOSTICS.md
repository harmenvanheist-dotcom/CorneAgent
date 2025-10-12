# Deployment Diagnostics Guide

## Problem Summary

You deployed the ChatKit starter app to Google Cloud Run, but you're seeing:
1. Error in browser console: `POST https://api.openai.com/v1/chatkit/domain_keys/verify_hosted 401 (Unauthorized)`
2. Message: "Set NEXT_PUBLIC_CHATKIT_WORKFLOW_ID in your .env.local file."

## Root Cause

The issue is likely that **environment variables from `.env.local` are NOT automatically loaded in production deployments**. The `.env.local` file only works in local development with `npm run dev`.

For Cloud Run deployments, you need to:
1. Set environment variables directly in the Cloud Run service configuration
2. Ensure `NEXT_PUBLIC_*` variables are set during the build process

## Diagnostic Tools

We've created two diagnostic endpoints to help you identify the exact issue:

### 1. Server-Side Diagnostics (API Endpoint)

**URL:** `https://openai-chatkit-starter-app-211859674907.europe-west1.run.app/api/diagnose`

**What it checks:**
- `OPENAI_API_KEY` (server-side)
- `CHATKIT_WORKFLOW_ID` (server-side)
- `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` (client-side)
- `CHATKIT_API_BASE` (optional)
- All relevant environment variables

**How to use:**
```bash
curl https://openai-chatkit-starter-app-211859674907.europe-west1.run.app/api/diagnose
```

Or visit in your browser: https://openai-chatkit-starter-app-211859674907.europe-west1.run.app/api/diagnose

### 2. Client-Side Diagnostics (Web Page)

**URL:** `https://openai-chatkit-starter-app-211859674907.europe-west1.run.app/diagnose`

**What it checks:**
- Client-side access to `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID`
- Browser compatibility (Custom Elements, Crypto API)
- Server-side configuration (via the API endpoint above)
- Provides visual summary and recommendations

**How to use:**
Visit in your browser: https://openai-chatkit-starter-app-211859674907.europe-west1.run.app/diagnose

## How to Fix: Setting Environment Variables in Cloud Run

### Option 1: Using Google Cloud Console (Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **Cloud Run** → Your service (`openai-chatkit-starter-app`)
3. Click **Edit & Deploy New Revision**
4. Scroll to **Variables & Secrets** section
5. Click **Add Variable** and add the following:

   | Name | Value | Description |
   |------|-------|-------------|
   | `OPENAI_API_KEY` | `sk-...` | Your OpenAI API key |
   | `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` | `wf_...` | Your workflow ID from Agent Builder |
   | `CHATKIT_API_BASE` (optional) | Custom API base | Only if using custom endpoint |

6. Click **Deploy**
7. Wait for deployment to complete
8. Test your app again

### Option 2: Using gcloud CLI

```bash
# Set environment variables
gcloud run services update openai-chatkit-starter-app \
  --region=europe-west1 \
  --set-env-vars="OPENAI_API_KEY=sk-your-key-here,NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_your-workflow-id"

# Or update from a file
gcloud run services update openai-chatkit-starter-app \
  --region=europe-west1 \
  --env-vars-file=.env.yaml
```

Create `.env.yaml` with:
```yaml
OPENAI_API_KEY: "sk-your-key-here"
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID: "wf_your-workflow-id"
```

### Option 3: Deploy with Environment Variables

When deploying, include the environment variables:

```bash
gcloud run deploy openai-chatkit-starter-app \
  --source . \
  --region=europe-west1 \
  --set-env-vars="OPENAI_API_KEY=sk-your-key,NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_your-workflow"
```

## Important Notes

### About `NEXT_PUBLIC_*` Variables

⚠️ **Critical:** `NEXT_PUBLIC_*` environment variables must be available **during the build process**, not just at runtime!

For Next.js apps on Cloud Run:
1. The app is built during deployment
2. `NEXT_PUBLIC_*` variables are embedded into the JavaScript bundle at build time
3. Setting them only at runtime won't work

**Solution:** Ensure environment variables are set **before** or **during** the Cloud Run build process.

### Build-Time vs Runtime

| Variable Type | When Needed | Where Used |
|--------------|-------------|------------|
| `NEXT_PUBLIC_*` | Build time + Runtime | Client-side (browser) |
| Regular env vars (e.g., `OPENAI_API_KEY`) | Runtime only | Server-side (API routes) |

### Security Best Practices

1. **Never commit** `.env.local` or any file with secrets to Git
2. Use **Secret Manager** for sensitive values:
   ```bash
   # Create secret
   gcloud secrets create openai-api-key --data-file=-
   # (paste your key, then Ctrl+D)
   
   # Use in Cloud Run
   gcloud run services update openai-chatkit-starter-app \
     --region=europe-west1 \
     --set-secrets="OPENAI_API_KEY=openai-api-key:latest"
   ```

## Troubleshooting Checklist

- [ ] Run diagnostic endpoint: `/api/diagnose`
- [ ] Visit diagnostic page: `/diagnose`
- [ ] Verify `OPENAI_API_KEY` is set in Cloud Run
- [ ] Verify `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` is set in Cloud Run
- [ ] Ensure workflow ID is not a placeholder (doesn't start with `wf_replace`)
- [ ] Rebuild and redeploy after setting environment variables
- [ ] Check Cloud Run logs for errors: `gcloud run services logs read openai-chatkit-starter-app --region=europe-west1`
- [ ] Verify domain is added to [OpenAI Domain Allowlist](https://platform.openai.com/settings/organization/security/domain-allowlist)

## Example: Complete Deployment

Here's a complete deployment script:

```bash
#!/bin/bash

# Set your variables
PROJECT_ID="your-project-id"
REGION="europe-west1"
SERVICE_NAME="openai-chatkit-starter-app"
OPENAI_API_KEY="sk-your-actual-key"
WORKFLOW_ID="wf_your-actual-workflow-id"

# Build and deploy with environment variables
gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars="OPENAI_API_KEY=${OPENAI_API_KEY},NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=${WORKFLOW_ID}" \
  --project $PROJECT_ID

echo "Deployment complete!"
echo "Visit: https://${SERVICE_NAME}-your-hash.${REGION}.run.app/diagnose"
```

## Getting Your Workflow ID

1. Go to [OpenAI Agent Builder](https://platform.openai.com/agent-builder)
2. Create or select your workflow
3. Click **Publish**
4. Copy the Workflow ID (starts with `wf_`)

## Testing the Fix

After setting environment variables and redeploying:

1. **Visit the diagnostic page:**
   ```
   https://your-app.run.app/diagnose
   ```

2. **Check for green checkmarks** on:
   - ✅ OPENAI_API_KEY
   - ✅ NEXT_PUBLIC_CHATKIT_WORKFLOW_ID
   - ✅ All client-side checks

3. **Try the main app:**
   ```
   https://your-app.run.app/
   ```

4. **No more errors!** The app should now load correctly.

## Additional Resources

- [Cloud Run Environment Variables](https://cloud.google.com/run/docs/configuring/environment-variables)
- [Cloud Run Secret Manager Integration](https://cloud.google.com/run/docs/configuring/secrets)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [OpenAI ChatKit Documentation](https://openai.github.io/chatkit-js/)
- [OpenAI Agent Builder](https://platform.openai.com/agent-builder)

## Need More Help?

Run the diagnostics and share the output. The diagnostic tools will tell you exactly what's missing and how to fix it.

