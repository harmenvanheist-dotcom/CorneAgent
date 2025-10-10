export async function GET() {
  // Allow debugging in production for troubleshooting

  // Get all environment variables for debugging
  const allEnvVars = Object.keys(process.env);
  const openaiEnvVars = allEnvVars.filter(key => key.includes('OPENAI') || key.includes('CHATKIT'));
  
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
    // Enhanced debugging info
    allEnvKeys: openaiEnvVars.sort(),
    totalEnvKeys: allEnvVars.length,
    awsEnvKeys: allEnvVars.filter(key => key.startsWith('AWS_')).slice(0, 5), // Show first 5 AWS vars
    amplifyEnvKeys: allEnvVars.filter(key => key.startsWith('AMPLIFY_')).slice(0, 5), // Show first 5 Amplify vars
    note: "Debugging environment variable loading issue"
  };

  return new Response(JSON.stringify(envStatus, null, 2), {
    headers: { 'Content-Type': 'application/json' }
  });
}
