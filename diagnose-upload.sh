#!/bin/bash

# File Upload Diagnostic Script
# This script helps diagnose file upload issues in ChatKit

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  ChatKit File Upload Diagnostic Tool                  ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo ""

# 1. Check if .env exists
echo -e "${BLUE}[1/7] Checking environment configuration...${NC}"
if [ ! -f .env ]; then
    echo -e "${RED}✗ .env file not found${NC}"
    exit 1
fi

# 2. Check API key
if grep -q "OPENAI_API_KEY=sk-" .env; then
    echo -e "${GREEN}✓ OpenAI API key configured${NC}"
    API_KEY=$(grep OPENAI_API_KEY .env | cut -d= -f2)
    echo -e "  Key prefix: ${API_KEY:0:20}..."
else
    echo -e "${RED}✗ OPENAI_API_KEY not configured${NC}"
    exit 1
fi

# 3. Check workflow ID
if grep -q "NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_" .env; then
    echo -e "${GREEN}✓ Workflow ID configured${NC}"
    WORKFLOW_ID=$(grep NEXT_PUBLIC_CHATKIT_WORKFLOW_ID .env | cut -d= -f2)
    echo -e "  Workflow: ${WORKFLOW_ID}"
else
    echo -e "${RED}✗ NEXT_PUBLIC_CHATKIT_WORKFLOW_ID not configured${NC}"
    exit 1
fi

# 4. Check if app is running
echo ""
echo -e "${BLUE}[2/7] Checking app status...${NC}"
if [ -f .chatkit.pid ] && kill -0 $(cat .chatkit.pid) 2>/dev/null; then
    echo -e "${GREEN}✓ App is running (PID: $(cat .chatkit.pid))${NC}"
else
    echo -e "${YELLOW}⚠ App is not running${NC}"
    echo -e "${YELLOW}  Run: make start${NC}"
fi

# 5. Test OpenAI API connectivity and get file upload limits
echo ""
echo -e "${BLUE}[3/7] Testing OpenAI API connectivity and checking file upload limits...${NC}"
API_RESPONSE=$(curl -s -X POST https://api.openai.com/v1/chatkit/sessions \
    -H "Authorization: Bearer ${API_KEY}" \
    -H "Content-Type: application/json" \
    -H "OpenAI-Beta: chatkit_beta=v1" \
    -d "{\"workflow\":{\"id\":\"${WORKFLOW_ID}\"},\"user\":\"diagnostic-test\",\"chatkit_configuration\":{\"file_upload\":{\"enabled\":true}}}" \
    2>/dev/null)

if echo "$API_RESPONSE" | grep -q "client_secret"; then
    echo -e "${GREEN}✓ API connection successful${NC}"
    
    # Extract file upload settings
    MAX_FILE_SIZE=$(echo "$API_RESPONSE" | grep -o '"max_file_size":[0-9]*' | cut -d: -f2)
    MAX_FILES=$(echo "$API_RESPONSE" | grep -o '"max_files":[0-9]*' | cut -d: -f2)
    
    if [ -n "$MAX_FILE_SIZE" ]; then
        echo -e "${GREEN}✓ File upload enabled${NC}"
        echo -e "  Max file size: ${MAX_FILE_SIZE} KB"
        echo -e "  Max files: ${MAX_FILES}"
        
        # Warning if file size is too small
        if [ "$MAX_FILE_SIZE" -lt 1024 ]; then
            echo -e "${RED}⚠ WARNING: File size limit is VERY SMALL (${MAX_FILE_SIZE} KB)${NC}"
            echo -e "${YELLOW}  Most files will exceed this limit!${NC}"
            echo -e "${YELLOW}  Recommended: Increase to 10240 KB (10 MB) in Agent Builder${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ File upload may not be enabled${NC}"
    fi
elif echo "$API_RESPONSE" | grep -q "error"; then
    ERROR_MSG=$(echo "$API_RESPONSE" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
    echo -e "${RED}✗ API Error: ${ERROR_MSG}${NC}"
else
    echo -e "${RED}✗ Cannot connect to OpenAI API${NC}"
    echo -e "${YELLOW}  Check your internet connection${NC}"
fi

# 6. Check logs for errors
echo ""
echo -e "${BLUE}[4/7] Checking recent logs...${NC}"
if [ -f chatkit.log ]; then
    ERROR_COUNT=$(grep -i "error" chatkit.log | tail -5 | wc -l)
    if [ "$ERROR_COUNT" -gt 0 ]; then
        echo -e "${YELLOW}⚠ Found ${ERROR_COUNT} recent errors:${NC}"
        grep -i "error" chatkit.log | tail -3 | sed 's/^/  /'
    else
        echo -e "${GREEN}✓ No recent errors in logs${NC}"
    fi
else
    echo -e "${YELLOW}⚠ No log file found${NC}"
fi

# 7. Check HTTPS setup
echo ""
echo -e "${BLUE}[5/7] Checking HTTPS configuration...${NC}"
if [ -f localhost.crt ] && [ -f localhost.key ]; then
    echo -e "${GREEN}✓ SSL certificates found${NC}"
else
    echo -e "${YELLOW}⚠ SSL certificates not found${NC}"
    echo -e "${YELLOW}  App may not work properly with file uploads over HTTP${NC}"
fi

# 8. Check port availability
echo ""
echo -e "${BLUE}[6/7] Checking port 3000...${NC}"
if lsof -ti:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Port 3000 is in use (app should be accessible)${NC}"
else
    echo -e "${YELLOW}⚠ Port 3000 is not in use${NC}"
    echo -e "${YELLOW}  Run: make start${NC}"
fi

# 9. Summary and recommendations
echo ""
echo -e "${BLUE}[7/7] Recommendations...${NC}"
echo ""
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  NEXT STEPS TO FIX FILE UPLOAD${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${RED}🎯 LIKELY CAUSE: File size limit is ${MAX_FILE_SIZE:-512} KB${NC}"
echo -e "${RED}   Most files exceed this limit!${NC}"
echo ""
echo -e "${GREEN}1. INCREASE FILE SIZE LIMIT (Recommended):${NC}"
echo "   → Go to: https://platform.openai.com/agent-builder"
echo "   → Open workflow: ${WORKFLOW_ID}"
echo "   → Find 'File Upload' settings"
echo "   → Change max size from ${MAX_FILE_SIZE:-512} KB to 10240 KB (10 MB)"
echo "   → REPUBLISH the workflow"
echo "   → Run: make restart"
echo ""
echo -e "${GREEN}2. OR Upload Smaller Files (Quick Test):${NC}"
echo "   → Try: ./test-small-file.txt (69 bytes - will work!)"
echo "   → Check file size: ls -lh yourfile.pdf"
echo "   → Must be under ${MAX_FILE_SIZE:-512} KB"
echo ""
echo -e "${GREEN}2. Check Browser Console:${NC}"
echo "   → Open your browser's Developer Tools (F12)"
echo "   → Go to Console tab"
echo "   → Try uploading a file"
echo "   → Copy any error messages"
echo ""
echo -e "${GREEN}3. Try Different Files:${NC}"
echo "   → Small text file (< 1MB)"
echo "   → Small image (< 5MB)"
echo "   → Note which types fail"
echo ""
echo -e "${GREEN}4. Common File Limits:${NC}"
echo "   → Max size: Usually 10-25MB"
echo "   → Allowed types: Check workflow settings"
echo "   → Supported: PDF, TXT, DOCX, CSV, PNG, JPG"
echo ""
echo -e "${GREEN}5. If Still Not Working:${NC}"
echo "   → Read: ./FILE_UPLOAD_TROUBLESHOOTING.md"
echo "   → Check OpenAI Status: https://status.openai.com"
echo "   → Contact OpenAI Support with workflow ID"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Additional diagnostic info
echo -e "${BLUE}Diagnostic Info (for support):${NC}"
echo ""
echo "Workflow ID: ${WORKFLOW_ID}"
echo "API Key: ${API_KEY:0:20}..."
echo "HTTP Response: ${HTTP_CODE}"
echo "App Running: $([ -f .chatkit.pid ] && kill -0 $(cat .chatkit.pid) 2>/dev/null && echo 'Yes' || echo 'No')"
echo "HTTPS Enabled: $([ -f localhost.crt ] && echo 'Yes' || echo 'No')"
echo ""
echo -e "${YELLOW}For more details, see:${NC}"
echo "  - ./FILE_UPLOAD_TROUBLESHOOTING.md"
echo "  - Browser Developer Console (F12)"
echo "  - make logs"
echo ""

