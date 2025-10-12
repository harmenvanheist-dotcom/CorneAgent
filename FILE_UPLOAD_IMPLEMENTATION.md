# File Upload Implementation Guide

This document describes the implementation of file upload support for the ChatKit Starter App while maintaining the Agent Builder workflow functionality.

## Overview

The implementation adds a custom `/api/chat` endpoint that:
1. Accepts multipart form data (prompt + optional file)
2. Uploads files to OpenAI's Files API
3. Executes the Agent Builder workflow with the file
4. Returns the workflow output

## Architecture

```
User → ChatKit UI → /api/chat → OpenAI Files API → Workflow → Response
```

### Key Components

1. **`/app/api/chat/route.ts`** - Server-side handler for file uploads and workflow execution
2. **Environment Variables** - Secure configuration for API keys and workflow IDs
3. **OpenAI SDK** - Handles file uploads and workflow execution

## Implementation Details

### 1. API Route Handler

The `/app/api/chat/route.ts` endpoint:
- Uses Node.js runtime (not Edge) to support file uploads
- Parses multipart form data from ChatKit
- Uploads files to OpenAI Files API with `purpose: "assistants"`
- Executes workflows using `client.workflows.runs.create()`
- Waits for completion using `client.workflows.runs.wait()`
- Returns formatted output

```typescript
export const runtime = "nodejs"; // Required for file upload support

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const prompt = formData.get("prompt") as string;
  const file = formData.get("file") as File | null;
  
  // Upload file if present
  if (file) {
    const fileUpload = await client.files.create({
      file: file,
      purpose: "assistants",
    });
    input.file_ids = [fileUpload.id];
  }
  
  // Execute workflow
  const run = await client.workflows.runs.create({
    workflow_id: process.env.CHATKIT_WORKFLOW_ID!,
    input,
  });
  
  const runResult = await client.workflows.runs.wait(run.id);
  return NextResponse.json({ text: runResult.output_text });
}
```

### 2. Environment Configuration

**Required Environment Variables:**

- `OPENAI_API_KEY` - Your OpenAI API key (from same org/project as Agent Builder)
- `CHATKIT_WORKFLOW_ID` - Your workflow ID (server-side only, secure)

**Migration from Previous Setup:**

If you previously used `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID`, you should:
1. Remove or comment out `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID`
2. Add `CHATKIT_WORKFLOW_ID` (without the `NEXT_PUBLIC_` prefix)

This change moves the workflow ID from client-side to server-side for better security.

### 3. Dependencies

The implementation requires the `openai` npm package:

```bash
npm install openai
```

This is already included in the setup.

## Setup Instructions

### Step 1: Update Environment Variables

Edit your `.env.local` file:

```bash
# Remove or comment this out:
# NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_...

# Add this instead:
CHATKIT_WORKFLOW_ID=wf_your_workflow_id_here
OPENAI_API_KEY=sk-proj-your_api_key_here
```

### Step 2: Configure Your Workflow

Your Agent Builder workflow should be configured to:
1. Accept a `prompt` input parameter
2. Optionally accept `file_ids` array for file attachments
3. Return output in a field like `output_text` or similar

Example workflow input schema:
```json
{
  "prompt": "string",
  "file_ids": ["string"]  // optional
}
```

### Step 3: Start the Development Server

```bash
npm run dev
```

Visit `https://localhost:3000` and test file uploads.

## Testing the Implementation

### Test 1: Text-Only Message
1. Type a message in the chat input
2. Press send
3. Verify the workflow responds correctly

### Test 2: File Upload
1. Click the "+ Add file" button
2. Select a file (PDF, image, text, etc.)
3. Add a prompt like "Summarize this file"
4. Press send
5. Check the browser console for:
   ```
   Uploading file: your-file-name.pdf
   ```
6. Verify the workflow processes the file and responds

### Test 3: Multiple Files (if supported)
Test with multiple file uploads if your workflow supports it.

## Workflow Execution Flow

```
┌─────────────────┐
│   User Input    │
│ (prompt + file) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  /api/chat      │
│  - Parse form   │
│  - Upload file  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ OpenAI Files API│
│  Returns file_id│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Workflow Run    │
│  - Create run   │
│  - Wait result  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Response      │
│  (output_text)  │
└─────────────────┘
```

## Advanced Features

### Streaming Responses (Optional)

To enable streaming responses (typing animation), replace:

```typescript
const runResult = await client.workflows.runs.wait(run.id);
```

with:

```typescript
const stream = await client.workflows.runs.stream(run.id);
// Handle stream chunks...
```

### Error Handling

The implementation includes comprehensive error handling:
- File upload failures
- Workflow execution errors
- Invalid input validation
- Missing environment variables

All errors are logged to the console and returned as JSON responses with appropriate status codes.

### Security Considerations

1. **API Key Protection** - Never expose `OPENAI_API_KEY` to the client
2. **Workflow ID Security** - Use `CHATKIT_WORKFLOW_ID` (server-side) instead of `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID`
3. **File Upload Validation** - Consider adding file size limits and type validation
4. **Rate Limiting** - Implement rate limiting in production
5. **Input Sanitization** - Validate and sanitize user inputs

## Troubleshooting

### Issue: "Missing OPENAI_API_KEY"
- Verify `.env.local` exists and contains `OPENAI_API_KEY`
- Restart the development server after adding environment variables

### Issue: "Missing workflow id"
- Check that `CHATKIT_WORKFLOW_ID` is set in `.env.local`
- Verify the workflow ID is correct (starts with `wf_`)

### Issue: File upload fails
- Check file size (OpenAI has limits)
- Verify the file type is supported by your workflow
- Check browser console for detailed error messages

### Issue: Workflow doesn't process file
- Verify your workflow is configured to accept `file_ids` parameter
- Check that the workflow has file access enabled in Agent Builder

## Console Logging

The implementation logs key events:

```
Uploading file: resume.pdf
→ Created file ID: file-abc123
→ Workflow run started: run-xyz456
```

In production, consider using a proper logging service instead of console.log.

## Performance Considerations

1. **File Upload Time** - Large files take longer to upload
2. **Workflow Execution** - Complex workflows may take time to complete
3. **Timeout Handling** - Consider implementing timeouts for long-running workflows
4. **Caching** - Cache workflow results if appropriate

## Next Steps

1. **Customize Workflow** - Modify your Agent Builder workflow to better handle files
2. **Add File Type Validation** - Restrict uploads to specific file types
3. **Implement Streaming** - Add streaming responses for better UX
4. **Add Progress Indicators** - Show upload and processing progress
5. **Error Messages** - Customize error messages for better user experience

## References

- [OpenAI Files API Documentation](https://platform.openai.com/docs/api-reference/files)
- [OpenAI Workflows API](https://platform.openai.com/docs/api-reference/workflows)
- [ChatKit Documentation](http://openai.github.io/chatkit-js/)
- [Agent Builder](https://platform.openai.com/agent-builder)

## Summary

| Feature                | Status                                    |
| ---------------------- | ----------------------------------------- |
| File uploads           | ✅ Supported (via backend proxy)           |
| Agent Builder workflow | ✅ Supported via `workflows.runs.create()` |
| Secure env handling    | ✅ via `CHATKIT_WORKFLOW_ID`               |
| Frontend UI unchanged  | ✅ Works as-is                             |
| Error handling         | ✅ Comprehensive                           |
| Console logging        | ✅ Detailed debugging info                 |
| Production ready       | ⚠️ Requires additional hardening          |


