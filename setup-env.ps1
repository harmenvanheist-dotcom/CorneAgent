# PowerShell script to help set up environment variables for ChatKit app

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "ChatKit Starter App - Environment Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local already exists
if (Test-Path ".env.local") {
    Write-Host "⚠️  .env.local already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Setup cancelled." -ForegroundColor Yellow
        exit 0
    }
}

Write-Host "This script will help you create your .env.local file." -ForegroundColor Green
Write-Host ""
Write-Host "You'll need:" -ForegroundColor White
Write-Host "  1. OpenAI API Key (from https://platform.openai.com/api-keys)" -ForegroundColor White
Write-Host "  2. ChatKit Workflow ID (from https://platform.openai.com/agent-builder)" -ForegroundColor White
Write-Host ""

# Collect required variables
Write-Host "Required Variables:" -ForegroundColor Yellow
Write-Host ""

Write-Host "Enter your OpenAI API Key (starts with 'sk-proj-' or 'sk-'): " -NoNewline -ForegroundColor White
$apiKey = Read-Host
while ([string]::IsNullOrWhiteSpace($apiKey)) {
    Write-Host "❌ API Key is required!" -ForegroundColor Red
    Write-Host "Enter your OpenAI API Key: " -NoNewline -ForegroundColor White
    $apiKey = Read-Host
}

Write-Host ""
Write-Host "Enter your ChatKit Workflow ID: " -NoNewline -ForegroundColor White
$workflowId = Read-Host
while ([string]::IsNullOrWhiteSpace($workflowId)) {
    Write-Host "❌ Workflow ID is required!" -ForegroundColor Red
    Write-Host "Enter your ChatKit Workflow ID: " -NoNewline -ForegroundColor White
    $workflowId = Read-Host
}

# Collect optional variables
Write-Host ""
Write-Host "Optional Variables (press Enter to skip):" -ForegroundColor Yellow
Write-Host ""

Write-Host "Enter your OpenAI Organization ID (optional): " -NoNewline -ForegroundColor White
$orgId = Read-Host

Write-Host "Enter your OpenAI Project ID (optional): " -NoNewline -ForegroundColor White
$projectId = Read-Host

# Create .env.local file
$envContent = @"
# OpenAI API Configuration
# Get your API key from: https://platform.openai.com/api-keys
# MUST be from the same org & project as your Agent Builder workflow
OPENAI_API_KEY=$apiKey

# ChatKit Workflow Configuration
# Get this from Agent Builder: https://platform.openai.com/agent-builder
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=$workflowId

"@

if (-not [string]::IsNullOrWhiteSpace($orgId)) {
    $envContent += @"
# Organization ID
OPENAI_ORG_ID=$orgId

"@
}

if (-not [string]::IsNullOrWhiteSpace($projectId)) {
    $envContent += @"
# Project ID
OPENAI_PROJECT_ID=$projectId

"@
}

$envContent += @"
# Optional: Custom ChatKit API endpoint (defaults to https://api.openai.com)
# CHATKIT_API_BASE=https://api.openai.com
"@

# Write to file
try {
    Set-Content -Path ".env.local" -Value $envContent -NoNewline
    Write-Host ""
    Write-Host "✅ .env.local file created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Run: npm install" -ForegroundColor White
    Write-Host "  2. Run: npm run dev" -ForegroundColor White
    Write-Host "  3. Open: http://localhost:3000" -ForegroundColor White
    Write-Host ""
    Write-Host "To deploy to AWS, see AWS_DEPLOYMENT_GUIDE.md" -ForegroundColor Yellow
} catch {
    Write-Host ""
    Write-Host "❌ Error creating .env.local file: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "You can manually create .env.local with this content:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host $envContent -ForegroundColor Gray
}

