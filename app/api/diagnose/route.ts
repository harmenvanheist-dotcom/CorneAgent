/**
 * Diagnostic endpoint to check environment variables and API configuration
 * 
 * This endpoint helps diagnose deployment issues by checking:
 * - Server-side environment variables
 * - API key presence (without exposing the key)
 * - Workflow ID configuration
 * - Node environment
 * 
 * Access at: /api/diagnose
 */

export const runtime = "edge";

interface DiagnosticResponse {
  timestamp: string;
  environment: string;
  checks: {
    name: string;
    status: "ok" | "warning" | "error";
    message: string;
    details?: Record<string, unknown>;
  }[];
  summary: {
    total: number;
    ok: number;
    warnings: number;
    errors: number;
  };
}

export async function GET(): Promise<Response> {
  const checks: DiagnosticResponse["checks"] = [];

  // Check 1: Node environment
  const nodeEnv = process.env.NODE_ENV || "not-set";
  checks.push({
    name: "NODE_ENV",
    status: nodeEnv ? "ok" : "warning",
    message: `Node environment is: ${nodeEnv}`,
    details: { value: nodeEnv },
  });

  // Check 2: OpenAI API Key (server-side)
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    checks.push({
      name: "OPENAI_API_KEY",
      status: "error",
      message: "Missing OPENAI_API_KEY environment variable",
      details: { configured: false },
    });
  } else {
    const keyPrefix = openaiApiKey.substring(0, 7);
    const keyLength = openaiApiKey.length;
    checks.push({
      name: "OPENAI_API_KEY",
      status: "ok",
      message: "API key is configured",
      details: {
        configured: true,
        prefix: keyPrefix,
        length: keyLength,
        valid_format: openaiApiKey.startsWith("sk-"),
      },
    });
  }

  // Check 3: Workflow ID (server-side)
  const workflowId = process.env.CHATKIT_WORKFLOW_ID;
  if (!workflowId) {
    checks.push({
      name: "CHATKIT_WORKFLOW_ID (server)",
      status: "warning",
      message: "Missing CHATKIT_WORKFLOW_ID environment variable (server-side)",
      details: { configured: false },
    });
  } else {
    checks.push({
      name: "CHATKIT_WORKFLOW_ID (server)",
      status: "ok",
      message: "Server-side workflow ID is configured",
      details: {
        configured: true,
        prefix: workflowId.substring(0, 3),
        length: workflowId.length,
      },
    });
  }

  // Check 4: Public Workflow ID (used by client)
  const publicWorkflowId = process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID;
  if (!publicWorkflowId) {
    checks.push({
      name: "NEXT_PUBLIC_CHATKIT_WORKFLOW_ID",
      status: "error",
      message:
        "Missing NEXT_PUBLIC_CHATKIT_WORKFLOW_ID environment variable (this is what the client uses)",
      details: { configured: false },
    });
  } else {
    checks.push({
      name: "NEXT_PUBLIC_CHATKIT_WORKFLOW_ID",
      status: "ok",
      message: "Public workflow ID is configured",
      details: {
        configured: true,
        prefix: publicWorkflowId.substring(0, 3),
        length: publicWorkflowId.length,
        is_placeholder: publicWorkflowId.startsWith("wf_replace"),
      },
    });
  }

  // Check 5: ChatKit API Base (optional)
  const apiBase = process.env.CHATKIT_API_BASE;
  checks.push({
    name: "CHATKIT_API_BASE",
    status: apiBase ? "ok" : "ok",
    message: apiBase
      ? `Custom API base configured: ${apiBase}`
      : "Using default API base: https://api.openai.com",
    details: {
      configured: Boolean(apiBase),
      value: apiBase || "https://api.openai.com (default)",
    },
  });

  // Check 6: All environment variables (keys only, no values)
  const allEnvKeys = Object.keys(process.env).filter(
    (key) =>
      key.startsWith("CHATKIT_") ||
      key.startsWith("NEXT_PUBLIC_") ||
      key === "OPENAI_API_KEY" ||
      key === "NODE_ENV"
  );
  checks.push({
    name: "Environment Variables",
    status: "ok",
    message: `Found ${allEnvKeys.length} relevant environment variable(s)`,
    details: {
      keys: allEnvKeys,
      count: allEnvKeys.length,
    },
  });

  // Calculate summary
  const summary = {
    total: checks.length,
    ok: checks.filter((c) => c.status === "ok").length,
    warnings: checks.filter((c) => c.status === "warning").length,
    errors: checks.filter((c) => c.status === "error").length,
  };

  const response: DiagnosticResponse = {
    timestamp: new Date().toISOString(),
    environment: nodeEnv,
    checks,
    summary,
  };

  // Add recommendation
  const recommendations: string[] = [];
  if (summary.errors > 0 || summary.warnings > 0) {
    if (!openaiApiKey) {
      recommendations.push(
        "Set OPENAI_API_KEY in your Cloud Run environment variables"
      );
    }
    if (!publicWorkflowId) {
      recommendations.push(
        "Set NEXT_PUBLIC_CHATKIT_WORKFLOW_ID in your Cloud Run environment variables"
      );
    }
    if (!workflowId && !publicWorkflowId) {
      recommendations.push(
        "You need either CHATKIT_WORKFLOW_ID (for server-side) or NEXT_PUBLIC_CHATKIT_WORKFLOW_ID (for client-side)"
      );
    }
    if (
      publicWorkflowId &&
      (publicWorkflowId.startsWith("wf_replace") || publicWorkflowId === "")
    ) {
      recommendations.push(
        "Your NEXT_PUBLIC_CHATKIT_WORKFLOW_ID appears to be a placeholder. Replace it with your actual workflow ID from Agent Builder."
      );
    }
  }

  return new Response(
    JSON.stringify(
      {
        ...response,
        recommendations:
          recommendations.length > 0 ? recommendations : ["All checks passed!"],
        deployment_notes: {
          platform: "Google Cloud Run",
          note: "In Cloud Run, make sure environment variables are set in the Cloud Run service configuration, not just in .env.local",
          how_to_fix:
            "Go to Cloud Console > Cloud Run > Your Service > Edit & Deploy New Revision > Variables & Secrets",
        },
      },
      null,
      2
    ),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    }
  );
}

export async function POST(): Promise<Response> {
  return new Response(
    JSON.stringify({ error: "Method not allowed. Use GET instead." }),
    {
      status: 405,
      headers: { "Content-Type": "application/json" },
    }
  );
}

