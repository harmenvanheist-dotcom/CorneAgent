# File Upload Troubleshooting Guide

## Quick Diagnosis Steps

### 1. Check Browser Console for Errors

Open your browser's Developer Console (F12) and look for error messages when you try to upload a file:

```javascript
// In browser console, check:
1. Network tab → Look for failed requests to OpenAI API
2. Console tab → Look for ChatKit errors
3. Look for messages like:
   - "File type not supported"
   - "File size exceeds limit"
   - "Workflow does not support file uploads"
   - CORS errors
```

### 2. Verify Workflow Configuration

**Critical:** Your Agent Builder workflow must be configured to accept file uploads.

1. Go to https://platform.openai.com/agent-builder
2. Open your workflow: `wf_68e96cb01e2c8190984930a610c404940ba9fe318a017dd6`
3. Check workflow settings for:
   - ✅ **File Upload** enabled
   - ✅ **Supported file types** configured
   - ✅ **File size limits** set appropriately
4. **Republish** the workflow after making changes
5. Restart the app: `make restart`

### 3. Common File Upload Restrictions

OpenAI ChatKit typically has these limitations:

- **File Size**: Usually 10-25MB maximum
- **File Types**: Check your workflow configuration for allowed types
  - Common: PDF, TXT, DOCX, CSV, JSON, PNG, JPG
  - May not support: EXE, ZIP, large videos
- **Session Limits**: May have per-session upload limits

### 4. Test with Different Files

Try uploading:
1. ✅ Small text file (< 1MB) - `echo "test" > test.txt`
2. ✅ Small image (< 5MB)
3. ❌ Note which files succeed/fail

### 5. Check Server Logs

```bash
# In the app directory
make logs

# Or directly:
tail -f chatkit.log
```

Look for error messages when file upload occurs.

### 6. Network/CORS Issues

If you see CORS errors in browser console:

1. **Domain Allowlist**: Your domain must be added to OpenAI's allowlist
   - Go to https://platform.openai.com/settings/organization/security/domain-allowlist
   - Add `localhost:3000` and your production domain
   
2. **HTTPS**: Ensure you're using HTTPS (default in this app)
   - File uploads may fail over HTTP
   - Self-signed cert is OK for development

### 7. API Key Permissions

Ensure your `OPENAI_API_KEY`:
- ✅ Is from the **same organization** as the Agent Builder workflow
- ✅ Has proper permissions for ChatKit
- ✅ Is not expired or rate-limited

Check: https://platform.openai.com/api-keys

## Debugging Commands

```bash
# Check if app is running
make status

# View live logs
make logs

# Restart app
make restart

# Check environment variables
cat .env | grep -v "^#"

# Test API key (optional)
curl https://api.openai.com/v1/chatkit/sessions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "OpenAI-Beta: chatkit_beta=v1" \
  -d '{
    "workflow": {"id": "wf_YOUR_WORKFLOW_ID"},
    "chatkit_configuration": {"file_upload": {"enabled": true}}
  }'
```

## Specific Error Messages & Solutions

### "File type not supported"
**Solution**: 
- Check workflow configuration for allowed file types
- Try a different file format (PDF, TXT, PNG are usually safe)

### "File size too large"
**Solution**:
- Reduce file size (compress images, split documents)
- Check workflow's file size limit
- OpenAI typically allows 10-25MB

### "Session error" or "Authentication failed"
**Solution**:
- Check `OPENAI_API_KEY` is correct
- Ensure API key is from same org as workflow
- Try creating a new session: `make restart`

### "Workflow does not support attachments"
**Solution**:
- Enable file uploads in Agent Builder workflow settings
- Republish the workflow
- Restart the app

### CORS errors
**Solution**:
- Add your domain to OpenAI domain allowlist
- Use HTTPS (not HTTP)
- Check browser is not blocking requests

## Configuration Checklist

File upload requires ALL of these:

- [ ] Agent Builder workflow has file upload enabled
- [ ] Workflow is published
- [ ] API key is from same org/project as workflow
- [ ] Domain is in OpenAI allowlist (for production)
- [ ] App is running over HTTPS
- [ ] Session creation is successful (check `make logs`)
- [ ] File meets type/size restrictions

## Still Not Working?

1. **Check OpenAI Status**: https://status.openai.com
2. **Review OpenAI Docs**: https://openai.github.io/chatkit-js/
3. **Contact OpenAI Support** with:
   - Workflow ID: `wf_68e96cb01e2c8190984930a610c404940ba9fe318a017dd6`
   - Organization ID
   - Browser console errors
   - Network request details

## Testing File Upload Manually

To verify if the issue is with the frontend or backend:

```javascript
// In browser console, after chat loads:
const chatkit = document.querySelector('openai-chatkit');
if (chatkit) {
  console.log('ChatKit element found');
  console.log('File upload enabled:', chatkit.config?.composer?.attachments?.enabled);
} else {
  console.error('ChatKit not loaded!');
}
```

## Quick Fix Attempts

```bash
# 1. Full restart
make stop
make clean-logs
make start

# 2. Clear browser cache and reload

# 3. Try in incognito/private window

# 4. Try different browser

# 5. Check .env file
cat .env
```

## Contact Support With This Info

If you need to contact OpenAI support, provide:

```bash
# Generate diagnostic info
echo "=== Environment ==="
cat .env | grep -v "KEY" | sed 's/=.*/=***/'
echo ""
echo "=== Server Logs (last 20 lines) ==="
tail -20 chatkit.log
echo ""
echo "=== Browser Console Errors ==="
echo "(Copy from browser developer console)"
echo ""
echo "=== File Details ==="
echo "File name: <filename>"
echo "File size: <size>"
echo "File type: <type>"
```


