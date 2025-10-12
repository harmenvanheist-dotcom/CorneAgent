#!/bin/bash

# Deploy ChatKit Starter App to Google Cloud Run with environment variables
# This script will deploy your app with the necessary environment variables

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}ChatKit Cloud Run Deployment${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-}"
REGION="${GCP_REGION:-europe-west1}"
SERVICE_NAME="${SERVICE_NAME:-openai-chatkit-starter-app}"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get project ID if not set
if [ -z "$PROJECT_ID" ]; then
    PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
    if [ -z "$PROJECT_ID" ]; then
        echo -e "${RED}Error: No GCP project set${NC}"
        echo "Set it with: gcloud config set project YOUR_PROJECT_ID"
        exit 1
    fi
fi

echo -e "${GREEN}Using Project:${NC} $PROJECT_ID"
echo -e "${GREEN}Region:${NC} $REGION"
echo -e "${GREEN}Service Name:${NC} $SERVICE_NAME"
echo ""

# Check for required environment variables
echo -e "${YELLOW}Checking environment variables...${NC}"

if [ -z "$OPENAI_API_KEY" ]; then
    echo -e "${RED}Error: OPENAI_API_KEY is not set${NC}"
    echo "Set it with: export OPENAI_API_KEY='sk-your-key-here'"
    exit 1
fi

if [ -z "$NEXT_PUBLIC_CHATKIT_WORKFLOW_ID" ]; then
    echo -e "${RED}Error: NEXT_PUBLIC_CHATKIT_WORKFLOW_ID is not set${NC}"
    echo "Set it with: export NEXT_PUBLIC_CHATKIT_WORKFLOW_ID='wf_your-workflow-id'"
    exit 1
fi

echo -e "${GREEN}✓ OPENAI_API_KEY is set${NC} (${OPENAI_API_KEY:0:7}...)"
echo -e "${GREEN}✓ NEXT_PUBLIC_CHATKIT_WORKFLOW_ID is set${NC} (${NEXT_PUBLIC_CHATKIT_WORKFLOW_ID:0:5}...)"
echo ""

# Optional: Build locally first to catch errors
echo -e "${YELLOW}Building locally to check for errors...${NC}"
if npm run build; then
    echo -e "${GREEN}✓ Local build successful${NC}"
else
    echo -e "${RED}✗ Local build failed. Fix errors before deploying.${NC}"
    exit 1
fi
echo ""

# Deploy to Cloud Run
echo -e "${YELLOW}Deploying to Cloud Run...${NC}"
echo "This may take 3-5 minutes..."
echo ""

gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --set-env-vars="OPENAI_API_KEY=${OPENAI_API_KEY},NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=${NEXT_PUBLIC_CHATKIT_WORKFLOW_ID}" \
  --project "$PROJECT_ID"

echo ""
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}Deployment Complete! 🎉${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""

# Get the service URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --platform managed --region "$REGION" --format 'value(status.url)' --project "$PROJECT_ID" 2>/dev/null)

if [ -n "$SERVICE_URL" ]; then
    echo -e "${BLUE}Your app is now available at:${NC}"
    echo -e "${GREEN}$SERVICE_URL${NC}"
    echo ""
    echo -e "${BLUE}Test the diagnostic tools:${NC}"
    echo -e "  Diagnostic Page: ${GREEN}${SERVICE_URL}/diagnose${NC}"
    echo -e "  Diagnostic API:  ${GREEN}${SERVICE_URL}/api/diagnose${NC}"
    echo ""
    echo -e "${YELLOW}Run diagnostics:${NC}"
    echo -e "  curl ${SERVICE_URL}/api/diagnose | jq ."
    echo ""
    echo -e "${YELLOW}Or use the test script:${NC}"
    echo -e "  ./scripts/test-deployment.sh ${SERVICE_URL}"
fi

