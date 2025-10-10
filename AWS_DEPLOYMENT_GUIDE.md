# AWS Amplify Deployment Guide for ChatKit Starter App

This guide will help you deploy the OpenAI ChatKit Starter App to AWS Amplify.

## Prerequisites

1. **OpenAI Account** with access to Agent Builder
2. **AWS Account** with Amplify access
3. **GitHub Repository** (your fork is ready at: `https://github.com/emanom/openai-chatkit-starter-app.git`)

## Step 1: Get Your OpenAI Credentials

### 1.1 Create a Workflow in Agent Builder
1. Go to [OpenAI Agent Builder](https://platform.openai.com/agent-builder)
2. Create or select a workflow
3. Copy the **Workflow ID** (you'll need this for `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID`)

### 1.2 Create an API Key
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key **in the same organization and project** as your Agent Builder workflow
3. Use a project-scoped key (starts with `sk-proj-`) for better security
4. Copy the key immediately (you won't be able to see it again)

### 1.3 Get Organization and Project IDs (Optional but Recommended)
1. **Organization ID**: Find in your [OpenAI Settings](https://platform.openai.com/settings/organization/general)
2. **Project ID**: Find in your project settings

## Step 2: Set Up Local Environment (Optional - for local testing)

Create a `.env.local` file in the `openai-chatkit-starter-app-1/` directory:

```bash
OPENAI_API_KEY=sk-proj-your-actual-key-here
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=your-workflow-id-here
OPENAI_ORG_ID=org-your-org-id-here
OPENAI_PROJECT_ID=proj_your-project-id-here
```

Test locally:
```bash
npm install
npm run dev
```

Visit http://localhost:3000 to verify it works.

## Step 3: Deploy to AWS Amplify

### Option A: Deploy via AWS Amplify Console (Recommended)

1. **Log in to AWS Console**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Select your region

2. **Create New App**
   - Click "New app" → "Host web app"
   - Choose "GitHub" as your Git provider
   - Authorize AWS Amplify to access your GitHub account

3. **Connect Repository**
   - Select your repository: `emanom/openai-chatkit-starter-app`
   - Choose branch: `main`
   - The app will detect Next.js automatically

4. **Configure Build Settings**
   - Amplify should auto-detect the `amplify.yml` file
   - Verify the build settings match:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

5. **Add Environment Variables**
   In the Amplify Console, go to "Environment variables" and add:
   
   | Variable | Value | Secret? |
   |----------|-------|---------|
   | `OPENAI_API_KEY` | Your API key (sk-proj-...) | ✅ Yes |
   | `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` | Your workflow ID | ❌ No |
   | `OPENAI_ORG_ID` | Your org ID (optional) | ✅ Yes |
   | `OPENAI_PROJECT_ID` | Your project ID (optional) | ✅ Yes |

   **Important**: Mark `OPENAI_API_KEY`, `OPENAI_ORG_ID`, and `OPENAI_PROJECT_ID` as secret!

6. **Deploy**
   - Click "Save and deploy"
   - Wait for the build to complete (usually 3-5 minutes)
   - You'll get a URL like: `https://main.xxxxxx.amplifyapp.com`

### Option B: Deploy via AWS CLI

If you prefer command-line deployment:

```bash
# Install AWS CLI and Amplify CLI
npm install -g @aws-amplify/cli

# Configure AWS credentials
amplify configure

# Initialize Amplify in your project
cd openai-chatkit-starter-app-1
amplify init

# Add hosting
amplify add hosting

# Set environment variables
amplify env add prod
amplify env checkout prod

# Deploy
amplify push
```

## Step 4: Verify Deployment

1. Visit your Amplify app URL
2. Try the chat interface
3. Check the browser console for any errors
4. Verify the workflow responds correctly

## Troubleshooting

### Build Fails
- **Check environment variables**: Ensure `OPENAI_API_KEY` and `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` are set
- **Check build logs**: Look for specific error messages in Amplify console

### Chat Doesn't Work
- **API Key Mismatch**: Ensure API key is from same org/project as workflow
- **CORS Issues**: Check browser console for CORS errors
- **Workflow Not Found**: Verify the workflow ID is correct

### 500 Error on Session Creation
- Check that `OPENAI_API_KEY` is valid and not expired
- Verify `OPENAI_PROJECT_ID` matches your workflow's project
- Check CloudWatch logs in Amplify console

## Security Best Practices

1. ✅ Use project-scoped API keys (sk-proj-) instead of org-level keys
2. ✅ Mark all sensitive environment variables as "secret" in Amplify
3. ✅ Set up custom domain with HTTPS (Amplify provides this)
4. ✅ Enable Amplify's basic authentication if needed for staging
5. ✅ Rotate API keys regularly

## Updating the Deployment

When you push changes to your GitHub repo:
1. Amplify will automatically detect and rebuild
2. Or manually trigger via "Redeploy this version" in Amplify console

## Cost Estimates

AWS Amplify pricing:
- **Free Tier**: 1,000 build minutes/month, 15GB served/month
- **After Free Tier**: ~$0.01 per build minute, ~$0.15 per GB served
- Estimated cost for moderate use: **$5-20/month**

OpenAI API costs depend on your ChatKit workflow usage.

## Next Steps

- [ ] Set up custom domain in Amplify
- [ ] Configure monitoring with CloudWatch
- [ ] Set up alerts for errors
- [ ] Add authentication if needed
- [ ] Customize the UI in `lib/config.ts` and `components/ChatKitPanel.tsx`

## Support

- [OpenAI ChatKit Documentation](https://platform.openai.com/docs/guides/chatkit)
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Next.js Documentation](https://nextjs.org/docs)

