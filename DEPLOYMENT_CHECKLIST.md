# AWS Amplify Deployment Checklist

Use this checklist to deploy your ChatKit app to AWS Amplify.

## Pre-Deployment ✅

- [ ] **OpenAI Setup**
  - [ ] Created a workflow in [Agent Builder](https://platform.openai.com/agent-builder)
  - [ ] Copied the Workflow ID
  - [ ] Created an API key from [API Keys page](https://platform.openai.com/api-keys)
  - [ ] Verified API key is from same org/project as workflow
  - [ ] (Optional) Noted your Organization ID
  - [ ] (Optional) Noted your Project ID

- [ ] **Local Testing (Recommended)**
  - [ ] Ran `./setup-env.ps1` to create `.env.local`
  - [ ] Ran `npm install`
  - [ ] Ran `npm run dev`
  - [ ] Tested at http://localhost:3000
  - [ ] Verified chat works with your workflow

- [ ] **GitHub Setup**
  - [ ] Code is pushed to GitHub
  - [ ] Repository is accessible: `https://github.com/emanom/openai-chatkit-starter-app`
  - [ ] On correct branch (`main`)

## AWS Amplify Setup 🚀

- [ ] **Step 1: Create Amplify App**
  - [ ] Logged into [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
  - [ ] Clicked "New app" → "Host web app"
  - [ ] Selected "GitHub" as Git provider
  - [ ] Authorized AWS Amplify to access GitHub

- [ ] **Step 2: Connect Repository**
  - [ ] Selected repository: `emanom/openai-chatkit-starter-app`
  - [ ] Selected branch: `main`
  - [ ] Clicked "Next"

- [ ] **Step 3: Configure Build Settings**
  - [ ] Verified build settings detected from `amplify.yml`
  - [ ] App name set (e.g., "chatkit-app")
  - [ ] Environment name set (e.g., "prod")
  - [ ] Clicked "Next"

- [ ] **Step 4: Add Environment Variables**
  - [ ] Clicked "Environment variables" (or "Advanced settings")
  - [ ] Added `OPENAI_API_KEY` (marked as secret ✅)
  - [ ] Added `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID`
  - [ ] (Optional) Added `OPENAI_ORG_ID` (marked as secret ✅)
  - [ ] (Optional) Added `OPENAI_PROJECT_ID` (marked as secret ✅)

- [ ] **Step 5: Deploy**
  - [ ] Clicked "Save and deploy"
  - [ ] Waited for build to complete (3-5 minutes)
  - [ ] Build status shows ✅ green

## Post-Deployment Testing ✅

- [ ] **Verify Deployment**
  - [ ] Opened the Amplify app URL (e.g., `https://main.d1234.amplifyapp.com`)
  - [ ] Page loads without errors
  - [ ] Chat interface appears
  - [ ] Sent a test message
  - [ ] Received response from workflow
  - [ ] Checked browser console for errors (should be none)

- [ ] **Check Logs**
  - [ ] In Amplify console, checked "Build logs" for any warnings
  - [ ] Reviewed CloudWatch logs if needed

## Optional Enhancements 🎨

- [ ] **Custom Domain**
  - [ ] Added custom domain in Amplify console
  - [ ] Configured DNS records
  - [ ] SSL certificate verified

- [ ] **Security**
  - [ ] Set up basic authentication for staging
  - [ ] Reviewed IAM permissions
  - [ ] Configured rate limiting if needed

- [ ] **Monitoring**
  - [ ] Set up CloudWatch alarms
  - [ ] Configured error notifications
  - [ ] Added application monitoring

- [ ] **Customization**
  - [ ] Updated starter prompts in `lib/config.ts`
  - [ ] Customized branding in `components/ChatKitPanel.tsx`
  - [ ] Modified theme/colors

## Troubleshooting 🔧

If you encounter issues, check:

1. **Build Fails**
   ```
   Solution: Check environment variables are set correctly
   ```

2. **500 Error on Session Creation**
   ```
   Solution: Verify API key matches workflow org/project
   ```

3. **Workflow Not Found**
   ```
   Solution: Double-check NEXT_PUBLIC_CHATKIT_WORKFLOW_ID
   ```

4. **CORS Errors**
   ```
   Solution: Usually not an issue with Amplify, but check API base URL
   ```

## Environment Variables Reference

| Variable | Required | Secret | Example |
|----------|----------|--------|---------|
| `OPENAI_API_KEY` | ✅ Yes | ✅ Yes | `sk-proj-abc123...` |
| `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` | ✅ Yes | ❌ No | `workflow_abc123` |
| `OPENAI_ORG_ID` | ❌ No | ✅ Yes | `org-abc123` |
| `OPENAI_PROJECT_ID` | ❌ No | ✅ Yes | `proj_abc123` |
| `CHATKIT_API_BASE` | ❌ No | ❌ No | `https://api.openai.com` |

## Quick Commands

```bash
# Test locally
npm run dev

# Build for production
npm run build

# Check for errors
npm run lint
```

## Support Resources

- 📘 [Full Deployment Guide](./AWS_DEPLOYMENT_GUIDE.md)
- 🌐 [OpenAI ChatKit Docs](https://platform.openai.com/docs/guides/chatkit)
- ☁️ [AWS Amplify Docs](https://docs.amplify.aws/)
- 💬 [Next.js Docs](https://nextjs.org/docs)

---

**Last Updated**: ${new Date().toISOString().split('T')[0]}

