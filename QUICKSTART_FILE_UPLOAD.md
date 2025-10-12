# Quick Start: File Upload Support

Get file uploads working in **3 minutes** ⚡

## Step 1: Update Environment Variables (30 seconds)

Create or edit `.env.local`:

```bash
OPENAI_API_KEY=sk-proj-your-actual-key-here
CHATKIT_WORKFLOW_ID=wf_your-workflow-id-here
```

Get these from:
- API Key: https://platform.openai.com/api-keys
- Workflow ID: https://platform.openai.com/agent-builder (click "Publish")

## Step 2: Start the Server (30 seconds)

```bash
npm run dev
```

Visit: `https://localhost:3000`

(Accept the certificate warning - it's normal for local dev)

## Step 3: Test File Upload (1 minute)

1. Click **"+ Add file"** button
2. Select any file (PDF, image, doc, etc.)
3. Type: *"What's in this file?"*
4. Press **Send**

✅ Check browser console for:
```
Uploading file: yourfile.pdf
```

## That's It! 🎉

Your ChatKit app now supports file uploads!

## What If It Doesn't Work?

### Error: "Missing CHATKIT_WORKFLOW_ID"
👉 Check `.env.local` has `CHATKIT_WORKFLOW_ID` (not `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID`)

### Error: "Missing OPENAI_API_KEY"
👉 Add your API key to `.env.local` and restart server

### File uploads but no response
👉 Configure your workflow to accept `file_ids` parameter in Agent Builder

### Still stuck?
👉 See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for detailed troubleshooting

## How It Works (Optional Reading)

```
You upload file → /api/chat endpoint → OpenAI Files API
                                     ↓
Your workflow receives file_ids ← File uploaded
                                     ↓
Workflow processes file → Returns response → You see it in UI
```

## Environment Variables Explained

| Variable | Purpose | Where |
|----------|---------|-------|
| `OPENAI_API_KEY` | Authenticates with OpenAI | Server-side |
| `CHATKIT_WORKFLOW_ID` | Your workflow to run | Server-side |

**Security Note:** These are server-side only (secure). Never expose them to the browser.

## Workflow Configuration

Your Agent Builder workflow should accept:

```json
{
  "prompt": "string",       // Required: user's message
  "file_ids": ["string"]    // Optional: uploaded file IDs
}
```

**Configure this in Agent Builder:**
1. Open your workflow
2. Add input parameter: `prompt` (string)
3. Add input parameter: `file_ids` (array, optional)
4. Use file_ids in your workflow logic
5. Publish

## File Types Supported

- 📄 PDFs
- 🖼️ Images (PNG, JPG, etc.)
- 📝 Text files
- 📊 Spreadsheets
- ...and more (depends on OpenAI's file support)

## File Size Limits

OpenAI has file size limits (check their docs). For large files:
- Consider compression
- Split into smaller chunks
- Use external storage + links

## Next Steps

- ✅ Test with different file types
- ✅ Customize the workflow in Agent Builder
- ✅ Add file size validation (see [FILE_UPLOAD_IMPLEMENTATION.md](FILE_UPLOAD_IMPLEMENTATION.md))
- ✅ Deploy to production (see [README.md](README.md))

## More Documentation

- [FILE_UPLOAD_IMPLEMENTATION.md](FILE_UPLOAD_IMPLEMENTATION.md) - Complete implementation guide
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Detailed migration steps
- [README.md](README.md) - Main project documentation

---

**Happy building! 🚀**

