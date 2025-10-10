export async function GET() {
  // Test session creation to debug issues
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const workflowId = process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID;
    const orgId = process.env.OPENAI_ORG_ID;
    const projectId = process.env.OPENAI_PROJECT_ID;

    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!workflowId) {
      return new Response(JSON.stringify({ error: 'Missing workflow ID' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Try to create a session
    const apiBase = process.env.CHATKIT_API_BASE ?? 'https://api.openai.com';
    const url = `${apiBase}/v1/chatkit/sessions`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`,
      'OpenAI-Beta': 'chatkit_beta=v1',
    };
    
    if (orgId) {
      headers['OpenAI-Organization'] = orgId;
    }
    
    if (projectId) {
      headers['OpenAI-Project'] = projectId;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        workflow: { id: workflowId },
        user: 'test-user-123'
      }),
    });

    const responseData = await response.json().catch(() => ({}));

    return new Response(JSON.stringify({
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      data: responseData,
      config: {
        hasApiKey: !!openaiApiKey,
        apiKeyPrefix: openaiApiKey.substring(0, 7) + '...',
        workflowId,
        hasOrgId: !!orgId,
        hasProjectId: !!projectId,
        apiBase
      }
    }, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Exception occurred',
      message: error instanceof Error ? error.message : String(error)
    }, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
