# Migration Guide: Adding File Upload Support

This guide helps you migrate your existing ChatKit Starter App to support file uploads with the Agent Builder workflow.

## Quick Migration Steps

### 1. Install the OpenAI SDK

```bash
npm install openai
```

✅ Already done if you just pulled the latest changes.

### 2. Update Environment Variables

Edit your `.env.local` file:

**Before:**
```bash
OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_...
```

**After:**
```bash
OPENAI_API_KEY=sk-proj-...
CHATKIT_WORKFLOW_ID=wf_...

# Comment out the old public variable:
# NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_...
```

**Why?** The workflow ID is now server-side only for better security and file upload support.

### 3. Restart Your Development Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### 4. Test File Upload

1. Visit `https://localhost:3000`
2. Click the "+ Add file" button in the chat interface
3. Select a file (PDF, image, text document, etc.)
4. Add a prompt like "What's in this file?"
5. Press send

**Expected Console Output:**
```
Uploading file: your-file-name.pdf
→ File uploaded successfully
→ Workflow executing...
```

## What Changed?

### New Files
- ✅ `app/api/chat/route.ts` - Custom endpoint for file uploads
- ✅ `FILE_UPLOAD_IMPLEMENTATION.md` - Complete implementation guide
- ✅ `MIGRATION_GUIDE.md` - This file

### Modified Files
- 📝 `README.md` - Updated with file upload documentation
- 📝 `package.json` - Added `openai` dependency

### No Changes Required To
- ✨ `components/ChatKitPanel.tsx` - Already configured for file uploads
- ✨ `app/App.tsx` - No changes needed
- ✨ `lib/config.ts` - Works as-is

## How It Works

### Old Flow (Session-Based)
```
User → ChatKit UI → /api/create-session → OpenAI ChatKit API → Workflow
```

### New Flow (File Upload)
```
User → ChatKit UI → /api/chat → OpenAI Files API → Workflow
```

The new `/api/chat` endpoint:
1. Receives the file upload
2. Uploads to OpenAI Files API
3. Passes file ID to workflow
4. Returns workflow output

## Configure Your Workflow

Your Agent Builder workflow should accept these inputs:

```json
{
  "prompt": "string",          // User message
  "file_ids": ["string"]       // Array of file IDs (optional)
}
```

**Example Workflow Setup in Agent Builder:**

1. Go to [Agent Builder](https://platform.openai.com/agent-builder)
2. Edit your workflow
3. Add input parameters:
   - `prompt` (string, required)
   - `file_ids` (array, optional)
4. Add logic to process files using the `file_ids`
5. Publish your workflow

## Troubleshooting

### Error: "Missing CHATKIT_WORKFLOW_ID"
- Check your `.env.local` file
- Ensure you're using `CHATKIT_WORKFLOW_ID` (not `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID`)
- Restart the dev server

### Error: "Missing OPENAI_API_KEY"
- Verify `.env.local` has `OPENAI_API_KEY=sk-proj-...`
- Ensure the key is from the same org/project as your workflow
- Restart the dev server

### File Upload Button Not Visible
- File upload is enabled by default in `ChatKitPanel.tsx` (line 276-280)
- Check browser console for errors
- Verify ChatKit is loading correctly

### Workflow Doesn't Receive File
- Ensure your workflow accepts `file_ids` parameter
- Check Agent Builder workflow configuration
- Verify file was uploaded (check console logs)

### File Upload Fails
- Check file size (OpenAI has limits)
- Verify file type is supported
- Check browser network tab for errors
- Review server logs

## Rollback Instructions

If you need to revert to the old setup:

1. **Restore environment variables:**
   ```bash
   NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_...
   # Remove: CHATKIT_WORKFLOW_ID
   ```

2. **Remove the `/api/chat` endpoint:**
   ```bash
   rm app/api/chat/route.ts
   ```

3. **Uninstall OpenAI SDK (optional):**
   ```bash
   npm uninstall openai
   ```

4. **Restart dev server:**
   ```bash
   npm run dev
   ```

## Next Steps

1. ✅ Test basic text messages
2. ✅ Test file uploads
3. ✅ Test different file types (PDF, images, text)
4. 📝 Customize error messages in `app/api/chat/route.ts`
5. 📝 Add file size validation
6. 📝 Implement rate limiting for production
7. 📝 Add upload progress indicators
8. 📝 Consider streaming responses for better UX

## Questions?

- See [FILE_UPLOAD_IMPLEMENTATION.md](FILE_UPLOAD_IMPLEMENTATION.md) for detailed implementation
- See [FILE_UPLOAD_TROUBLESHOOTING.md](FILE_UPLOAD_TROUBLESHOOTING.md) for common issues
- Check [OpenAI Documentation](https://platform.openai.com/docs)

## Summary Checklist

- [ ] Installed `openai` package
- [ ] Updated `.env.local` with `CHATKIT_WORKFLOW_ID`
- [ ] Removed/commented `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID`
- [ ] Restarted development server
- [ ] Tested text-only messages
- [ ] Tested file uploads
- [ ] Configured workflow to accept `file_ids`
- [ ] Verified file processing works

---

**Migration Complete!** 🎉

Your ChatKit Starter App now supports file uploads while maintaining full Agent Builder workflow functionality.


