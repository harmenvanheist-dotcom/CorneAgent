# `/api/chat` - File Upload Endpoint

This endpoint handles file uploads and workflow execution for the ChatKit Starter App.

## Overview

The `/api/chat` endpoint:
1. Accepts multipart form data (prompt + optional file)
2. Uploads files to OpenAI Files API
3. Executes Agent Builder workflow with file IDs
4. Returns workflow output

## Request Format

**Method:** `POST`

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `prompt` (string, required) - User's message
- `file` (File, optional) - File to upload

## Response Format

**Success (200):**
```json
{
  "text": "Workflow output text here..."
}
```

**Error (500):**
```json
{
  "error": "Error message here"
}
```

## Environment Variables Required

- `OPENAI_API_KEY` - Your OpenAI API key
- `CHATKIT_WORKFLOW_ID` - Your workflow ID from Agent Builder
- `CHATKIT_API_BASE` (optional) - Custom API base URL

## Example Usage

### JavaScript/TypeScript

```typescript
const formData = new FormData();
formData.append('prompt', 'What is in this file?');
formData.append('file', fileObject);

const response = await fetch('/api/chat', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
console.log(result.text);
```

### cURL

```bash
curl -X POST https://localhost:3000/api/chat \
  -F "prompt=Summarize this document" \
  -F "file=@/path/to/file.pdf"
```

## Workflow Integration

Your Agent Builder workflow receives:

```json
{
  "prompt": "User's message",
  "file_ids": ["file-abc123"]  // Only if file uploaded
}
```

Configure your workflow to accept these parameters in Agent Builder.

## Error Handling

The endpoint handles:
- Missing environment variables
- File upload failures
- Workflow execution errors
- Timeout errors (60 seconds max)
- Invalid input

All errors are logged to console and returned as JSON with status 500.

## Logging

Console logs show:
```
Uploading file: filename.pdf
Workflow run created: run-xyz123
```

Check browser console and server logs for debugging.

## Technical Details

- **Runtime:** Node.js (required for file uploads)
- **Timeout:** 60 seconds
- **Polling:** 1-second intervals
- **Max Attempts:** 60 polls
- **File Purpose:** `assistants`
- **API Version:** Uses `OpenAI-Beta: chatkit_beta=v1` header

## Security Notes

- API key never exposed to client
- Workflow ID server-side only
- Consider adding:
  - Rate limiting
  - File size validation
  - File type validation
  - Authentication

## Customization

You can modify this endpoint to:
- Add file size limits
- Validate file types
- Implement streaming responses
- Add progress tracking
- Customize error messages
- Add caching
- Implement retries

See the main documentation for examples.

## References

- [FILE_UPLOAD_IMPLEMENTATION.md](../../../FILE_UPLOAD_IMPLEMENTATION.md)
- [OpenAI Files API](https://platform.openai.com/docs/api-reference/files)
- [OpenAI Workflows API](https://platform.openai.com/docs/api-reference/workflows)


