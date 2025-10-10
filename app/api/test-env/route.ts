export async function GET() {
  // Simple test to see what environment variables exist
  const testVars = {
    workflowId: process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID || 'UNDEFINED',
    apiKey: process.env.OPENAI_API_KEY ? 'EXISTS' : 'UNDEFINED',
    orgId: process.env.OPENAI_ORG_ID ? 'EXISTS' : 'UNDEFINED', 
    projectId: process.env.OPENAI_PROJECT_ID ? 'EXISTS' : 'UNDEFINED',
    nodeEnv: process.env.NODE_ENV,
    // Show first few characters of workflow ID if it exists
    workflowIdPreview: process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID ? 
      process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID.substring(0, 10) + '...' : 'UNDEFINED'
  };

  return new Response(JSON.stringify(testVars, null, 2), {
    headers: { 'Content-Type': 'application/json' }
  });
}
