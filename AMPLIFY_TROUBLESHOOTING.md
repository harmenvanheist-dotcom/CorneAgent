# AWS Amplify Troubleshooting: Can't Find Repository

## Problem: Can't Select `openai-chatkit-starter-app` in Amplify

If you're seeing `fyi-internal` but not `openai-chatkit-starter-app` in AWS Amplify's repository list, here are the solutions:

## Solution 1: Check GitHub Authorization (Most Common)

### Step 1: Update GitHub App Permissions

1. Go to **AWS Amplify Console** → Click "New app" → "Host web app"
2. When you see the GitHub option, look for a **"GitHub settings"** or **"Manage access"** link
3. Or go directly to: https://github.com/settings/installations
4. Find **"AWS Amplify"** in the list
5. Click **"Configure"**

### Step 2: Grant Access to the Repository

You'll see two options:
- ⭕ **All repositories** (easiest - select this)
- ⭕ **Only select repositories**

**Option A - All Repositories (Recommended):**
- Select "All repositories"
- Click "Save"
- Go back to Amplify Console and refresh

**Option B - Selected Repositories:**
- Select "Only select repositories"
- Click the dropdown and add: `openai-chatkit-starter-app`
- Make sure it's checked ✅
- Click "Save"

### Step 3: Refresh Amplify

1. Go back to AWS Amplify Console
2. Start the "New app" flow again
3. Select GitHub
4. You should now see `emanom/openai-chatkit-starter-app` in the list

---

## Solution 2: Re-authorize AWS Amplify

If the above doesn't work:

1. **Disconnect AWS Amplify from GitHub:**
   - Go to https://github.com/settings/installations
   - Find "AWS Amplify"
   - Click "Configure" → Scroll down → "Uninstall"

2. **Reconnect in AWS Amplify:**
   - Go back to AWS Amplify Console
   - Click "New app" → "Host web app" → "GitHub"
   - Click "Authorize AWS Amplify" (it will ask again)
   - **Select "All repositories"** when prompted
   - Complete the authorization

3. **Select Your Repository:**
   - You should now see both repositories
   - Select: `emanom/openai-chatkit-starter-app`
   - Branch: `main`

---

## Solution 3: Deploy Using AWS CLI (Alternative)

If you prefer not to use the console, you can deploy via CLI:

### Prerequisites
```powershell
# Install AWS CLI (if not already installed)
# Download from: https://aws.amazon.com/cli/

# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure AWS credentials
aws configure
```

### Deploy
```powershell
cd C:\Users\MannyLetellier\code\fyi-internal\openai-chatkit-starter-app-1

# Initialize Amplify
amplify init

# Follow the prompts:
# - Enter a name for the project: chatkit-app
# - Enter a name for the environment: prod
# - Choose your default editor: Visual Studio Code (or your preference)
# - Choose the type of app: javascript
# - What javascript framework are you using: react
# - Source Directory Path: .
# - Distribution Directory Path: .next
# - Build Command: npm run build
# - Start Command: npm run dev
# - Do you want to use an AWS profile? Yes
# - Please choose the profile you want to use: default (or your profile)

# Add hosting
amplify add hosting

# Select: "Hosting with Amplify Console"
# Select: "Manual deployment"

# Deploy
amplify publish
```

---

## Solution 4: Alternative - Deploy from `fyi-internal` with Custom Build Config

If you want to deploy from the `fyi-internal` repository (with the subfolder), you can do this by updating the build configuration:

### Step 1: Update `fyi-internal` Repository

Create an `amplify.yml` in the **root** of `fyi-internal`:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd openai-chatkit-starter-app-1
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: openai-chatkit-starter-app-1/.next
    files:
      - '**/*'
  cache:
    paths:
      - openai-chatkit-starter-app-1/node_modules/**/*
```

### Step 2: Connect `fyi-internal` to Amplify

1. In AWS Amplify, select `fyi-internal` repository
2. Select branch: `main`
3. Amplify will detect the `amplify.yml` at the root
4. Add environment variables as before
5. Deploy!

**Note**: This approach deploys from the parent repo but builds from the subfolder.

---

## Verification

After connecting, you should see in Amplify:

```
Repository: emanom/openai-chatkit-starter-app
Branch: main
Build config detected: Yes (amplify.yml)
```

---

## Still Having Issues?

### Check Repository Visibility
Make sure your repository is not private, or if it is, that AWS Amplify has access:

```powershell
# Check if repo is public/private
# Go to: https://github.com/emanom/openai-chatkit-starter-app/settings
```

If it's **private**, you need to ensure AWS Amplify's GitHub App has permission to access private repositories.

### Contact Points
- **AWS Amplify Support**: https://console.aws.amazon.com/support/
- **GitHub Settings**: https://github.com/settings/installations
- **Check Repository**: https://github.com/emanom/openai-chatkit-starter-app

---

## Quick Checklist

- [ ] Went to https://github.com/settings/installations
- [ ] Found "AWS Amplify" in the list
- [ ] Clicked "Configure"
- [ ] Selected "All repositories" OR added `openai-chatkit-starter-app`
- [ ] Saved changes
- [ ] Refreshed AWS Amplify Console
- [ ] Started "New app" flow again
- [ ] Can now see `emanom/openai-chatkit-starter-app` in the list

---

**Remember**: You want to connect to `emanom/openai-chatkit-starter-app`, NOT `emanom/fyi-internal`!

