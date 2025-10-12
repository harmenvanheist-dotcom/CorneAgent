"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Client-side diagnostic page
 * 
 * This page checks both client-side and server-side configurations
 * Access at: /diagnose
 */

interface Check {
  name: string;
  status: "ok" | "warning" | "error";
  message: string;
  details?: Record<string, unknown>;
}

interface DiagnosticData {
  timestamp: string;
  environment: string;
  checks: Check[];
  summary: {
    total: number;
    ok: number;
    warnings: number;
    errors: number;
  };
  recommendations?: string[];
  deployment_notes?: {
    platform: string;
    note: string;
    how_to_fix: string;
  };
}

export default function DiagnosePage() {
  const [serverDiagnostics, setServerDiagnostics] =
    useState<DiagnosticData | null>(null);
  const [clientChecks, setClientChecks] = useState<Check[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function runDiagnostics() {
      // Client-side checks
      const clientCheckResults: Check[] = [];

      // Check 1: Client-side workflow ID
      const clientWorkflowId =
        process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID || "";
      if (!clientWorkflowId) {
        clientCheckResults.push({
          name: "Client: NEXT_PUBLIC_CHATKIT_WORKFLOW_ID",
          status: "error",
          message:
            "Environment variable not accessible from client. This means it wasn't set during build or at runtime.",
          details: {
            value: clientWorkflowId,
            configured: false,
          },
        });
      } else if (clientWorkflowId.startsWith("wf_replace")) {
        clientCheckResults.push({
          name: "Client: NEXT_PUBLIC_CHATKIT_WORKFLOW_ID",
          status: "warning",
          message: "Workflow ID is still a placeholder value",
          details: {
            value: clientWorkflowId,
            configured: true,
            is_placeholder: true,
          },
        });
      } else {
        clientCheckResults.push({
          name: "Client: NEXT_PUBLIC_CHATKIT_WORKFLOW_ID",
          status: "ok",
          message: "Workflow ID is accessible from client",
          details: {
            prefix: clientWorkflowId.substring(0, 3),
            length: clientWorkflowId.length,
            configured: true,
          },
        });
      }

      // Check 2: Browser environment
      clientCheckResults.push({
        name: "Client: Browser Environment",
        status: "ok",
        message: `Running in browser: ${typeof window !== "undefined"}`,
        details: {
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
          url: typeof window !== "undefined" ? window.location.href : "unknown",
        },
      });

      // Check 3: Custom elements support
      const hasCustomElements =
        typeof window !== "undefined" &&
        typeof window.customElements !== "undefined";
      clientCheckResults.push({
        name: "Client: Custom Elements Support",
        status: hasCustomElements ? "ok" : "error",
        message: hasCustomElements
          ? "Browser supports custom elements (required for ChatKit)"
          : "Browser does not support custom elements",
        details: {
          supported: hasCustomElements,
        },
      });

      // Check 4: Crypto API
      const hasCrypto =
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function";
      clientCheckResults.push({
        name: "Client: Crypto API",
        status: hasCrypto ? "ok" : "warning",
        message: hasCrypto
          ? "Crypto API available"
          : "Crypto API not available (may cause issues)",
        details: {
          available: hasCrypto,
        },
      });

      setClientChecks(clientCheckResults);

      // Fetch server-side diagnostics
      try {
        const response = await fetch("/api/diagnose");
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        const data = await response.json();
        setServerDiagnostics(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch server diagnostics"
        );
      } finally {
        setLoading(false);
      }
    }

    runDiagnostics();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ok":
        return "text-green-600 dark:text-green-400";
      case "warning":
        return "text-yellow-600 dark:text-yellow-400";
      case "error":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-block px-2 py-1 text-xs font-semibold rounded";
    switch (status) {
      case "ok":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case "warning":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
      case "error":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🔍 ChatKit Deployment Diagnostics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This page checks your environment variables and configuration to help
            diagnose deployment issues.
          </p>
          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Running diagnostics...
              </p>
            </div>
          )}
        </div>

        {/* Client-side checks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Client-Side Checks
          </h2>
          <div className="space-y-4">
            {clientChecks.map((check, idx) => (
              <div key={idx} className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {check.name}
                    </h3>
                    <p className={`text-sm mt-1 ${getStatusColor(check.status)}`}>
                      {check.message}
                    </p>
                    {check.details && (
                      <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-x-auto">
                        {JSON.stringify(check.details, null, 2)}
                      </pre>
                    )}
                  </div>
                  <span className={getStatusBadge(check.status)}>
                    {check.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Server-side checks */}
        {!loading && serverDiagnostics && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Server-Side Checks
              </h2>
              
              {/* Summary */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {serverDiagnostics.summary.total}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total
                  </div>
                </div>
                <div className="bg-green-100 dark:bg-green-900 p-4 rounded">
                  <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                    {serverDiagnostics.summary.ok}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Passed
                  </div>
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded">
                  <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
                    {serverDiagnostics.summary.warnings}
                  </div>
                  <div className="text-sm text-yellow-600 dark:text-yellow-400">
                    Warnings
                  </div>
                </div>
                <div className="bg-red-100 dark:bg-red-900 p-4 rounded">
                  <div className="text-2xl font-bold text-red-800 dark:text-red-200">
                    {serverDiagnostics.summary.errors}
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400">
                    Errors
                  </div>
                </div>
              </div>

              {/* Checks */}
              <div className="space-y-4">
                {serverDiagnostics.checks.map((check, idx) => (
                  <div key={idx} className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {check.name}
                        </h3>
                        <p className={`text-sm mt-1 ${getStatusColor(check.status)}`}>
                          {check.message}
                        </p>
                        {check.details && (
                          <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-x-auto">
                            {JSON.stringify(check.details, null, 2)}
                          </pre>
                        )}
                      </div>
                      <span className={getStatusBadge(check.status)}>
                        {check.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            {serverDiagnostics.recommendations && serverDiagnostics.recommendations.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900 rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                  📋 Recommendations
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  {serverDiagnostics.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-blue-800 dark:text-blue-200">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Deployment Notes */}
            {serverDiagnostics.deployment_notes && (
              <div className="bg-purple-50 dark:bg-purple-900 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-4">
                  🚀 {serverDiagnostics.deployment_notes.platform} Deployment
                </h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-1">
                      Note:
                    </h3>
                    <p className="text-purple-700 dark:text-purple-300">
                      {serverDiagnostics.deployment_notes.note}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-1">
                      How to Fix:
                    </h3>
                    <p className="text-purple-700 dark:text-purple-300">
                      {serverDiagnostics.deployment_notes.how_to_fix}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-2">
              Error Fetching Server Diagnostics
            </h2>
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors"
          >
            ← Back to App
          </Link>
        </div>
      </div>
    </div>
  );
}

