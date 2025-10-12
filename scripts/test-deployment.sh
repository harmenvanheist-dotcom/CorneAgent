#!/bin/bash

# Test deployment script
# This script tests your Cloud Run deployment and checks for common issues

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEPLOYMENT_URL="${1:-https://openai-chatkit-starter-app-211859674907.europe-west1.run.app}"

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}ChatKit Deployment Diagnostics${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Test 1: Check if the app is reachable
echo -e "${YELLOW}Test 1: Checking if app is reachable...${NC}"
if curl -f -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL" | grep -q "200"; then
    echo -e "${GREEN}✓ App is reachable${NC}"
else
    echo -e "${RED}✗ App is not reachable or returned an error${NC}"
    exit 1
fi
echo ""

# Test 2: Check diagnostic API endpoint
echo -e "${YELLOW}Test 2: Checking server-side diagnostics...${NC}"
DIAGNOSTIC_RESPONSE=$(curl -s "$DEPLOYMENT_URL/api/diagnose")

if echo "$DIAGNOSTIC_RESPONSE" | jq -e . >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Diagnostic API is working${NC}"
    
    # Parse the response
    TOTAL=$(echo "$DIAGNOSTIC_RESPONSE" | jq -r '.summary.total')
    OK=$(echo "$DIAGNOSTIC_RESPONSE" | jq -r '.summary.ok')
    WARNINGS=$(echo "$DIAGNOSTIC_RESPONSE" | jq -r '.summary.warnings')
    ERRORS=$(echo "$DIAGNOSTIC_RESPONSE" | jq -r '.summary.errors')
    
    echo ""
    echo -e "  Total checks: ${BLUE}$TOTAL${NC}"
    echo -e "  Passed: ${GREEN}$OK${NC}"
    echo -e "  Warnings: ${YELLOW}$WARNINGS${NC}"
    echo -e "  Errors: ${RED}$ERRORS${NC}"
    echo ""
    
    # Show checks
    echo -e "${YELLOW}Detailed Results:${NC}"
    echo "$DIAGNOSTIC_RESPONSE" | jq -r '.checks[] | "  [\(.status | ascii_upcase)] \(.name): \(.message)"' | while read -r line; do
        if [[ $line == *"[OK]"* ]]; then
            echo -e "${GREEN}$line${NC}"
        elif [[ $line == *"[WARNING]"* ]]; then
            echo -e "${YELLOW}$line${NC}"
        elif [[ $line == *"[ERROR]"* ]]; then
            echo -e "${RED}$line${NC}"
        else
            echo "$line"
        fi
    done
    echo ""
    
    # Show recommendations
    RECOMMENDATIONS=$(echo "$DIAGNOSTIC_RESPONSE" | jq -r '.recommendations[]' 2>/dev/null)
    if [ -n "$RECOMMENDATIONS" ]; then
        echo -e "${BLUE}Recommendations:${NC}"
        echo "$DIAGNOSTIC_RESPONSE" | jq -r '.recommendations[] | "  • \(.)"'
        echo ""
    fi
    
    # Check for critical errors
    if [ "$ERRORS" -gt 0 ]; then
        echo -e "${RED}⚠️  Found $ERRORS critical error(s). Please fix them before using the app.${NC}"
        echo ""
        echo -e "${BLUE}How to fix:${NC}"
        echo "$DIAGNOSTIC_RESPONSE" | jq -r '.deployment_notes.how_to_fix' | sed 's/^/  /'
        echo ""
    else
        echo -e "${GREEN}✓ All critical checks passed!${NC}"
    fi
else
    echo -e "${RED}✗ Failed to parse diagnostic response${NC}"
    echo "$DIAGNOSTIC_RESPONSE"
    exit 1
fi
echo ""

# Test 3: Check main page
echo -e "${YELLOW}Test 3: Checking main page...${NC}"
MAIN_PAGE=$(curl -s "$DEPLOYMENT_URL")
if echo "$MAIN_PAGE" | grep -q "openai-chatkit\|ChatKit"; then
    echo -e "${GREEN}✓ Main page loads ChatKit component${NC}"
else
    echo -e "${YELLOW}⚠ Main page might not be loading ChatKit correctly${NC}"
fi
echo ""

# Test 4: Check for API errors in console
echo -e "${YELLOW}Test 4: Testing session creation endpoint...${NC}"
SESSION_RESPONSE=$(curl -s -X POST "$DEPLOYMENT_URL/api/create-session" \
    -H "Content-Type: application/json" \
    -d '{"workflow":{"id":"test"}}' \
    -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$SESSION_RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ Session creation endpoint works${NC}"
elif [ "$HTTP_STATUS" = "400" ] || [ "$HTTP_STATUS" = "500" ]; then
    echo -e "${YELLOW}⚠ Session creation returned error (this might be expected if workflow ID is not set)${NC}"
    echo "  Response: $(echo "$SESSION_RESPONSE" | grep -v "HTTP_STATUS:")"
else
    echo -e "${RED}✗ Unexpected response from session creation${NC}"
    echo "$SESSION_RESPONSE"
fi
echo ""

# Summary
echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}Summary${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""
echo -e "Deployment URL: ${BLUE}$DEPLOYMENT_URL${NC}"
echo -e "Diagnostic Page: ${BLUE}$DEPLOYMENT_URL/diagnose${NC}"
echo -e "Diagnostic API: ${BLUE}$DEPLOYMENT_URL/api/diagnose${NC}"
echo ""

if [ "$ERRORS" -gt 0 ]; then
    echo -e "${RED}Status: NEEDS ATTENTION${NC}"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "1. Visit the diagnostic page in your browser:"
    echo -e "   ${BLUE}$DEPLOYMENT_URL/diagnose${NC}"
    echo ""
    echo "2. Follow the recommendations to fix the errors"
    echo ""
    echo "3. Set environment variables in Cloud Run:"
    echo "   • OPENAI_API_KEY"
    echo "   • NEXT_PUBLIC_CHATKIT_WORKFLOW_ID"
    echo ""
    echo "4. Redeploy and run this test again"
    exit 1
else
    echo -e "${GREEN}Status: HEALTHY ✓${NC}"
    echo ""
    echo -e "Your app should be working correctly!"
    echo -e "Visit: ${BLUE}$DEPLOYMENT_URL${NC}"
fi

