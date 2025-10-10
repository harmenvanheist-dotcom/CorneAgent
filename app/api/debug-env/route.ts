export async function GET() {
  // Allow debugging in production for troubleshooting

  const envStatus = {
    hasOpenaiApiKey: !!process.env.OPENAI_API_KEY,
    hasWorkflowId: !!process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID,
    hasOrgId: !!process.env.OPENAI_ORG_ID,
    hasProjectId: !!process.env.OPENAI_PROJECT_ID,
    nodeEnv: process.env.NODE_ENV,
    // Don't expose actual values for security
    apiKeyPrefix: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 7) + '...' : 'MISSING',
    workflowId: process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID ? 'SET' : 'MISSING',
    orgId: process.env.OPENAI_ORG_ID ? 'SET' : 'MISSING',
    projectId: process.env.OPENAI_PROJECT_ID ? 'SET' : 'MISSING',
    // Additional debugging info
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('OPENAI') || key.includes('CHATKIT')).sort(),
    note: "If secrets are missing, they might be in Secret Management instead of Environment Variables"
  };

  return new Response(JSON.stringify(envStatus, null, 2), {
    headers: { 'Content-Type': 'application/json' }
  });
}
