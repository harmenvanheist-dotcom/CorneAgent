import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  defaultHeaders: {
    "OpenAI-Beta": "chatkit_beta=v1",
  },
});

export const runtime = "nodejs"; // ensure file upload support (not Edge)

export async function POST(req: NextRequest) {
  try {
    // Parse the multipart form data (prompt + optional file)
    const formData = await req.formData();
    const prompt = formData.get("prompt") as string;
    const file = formData.get("file") as File | null;

    // Prepare the input for the workflow
    const input: Record<string, unknown> = { prompt };

    // If a file is attached, upload it to OpenAI Files API
    if (file) {
      console.log(`Uploading file: ${file.name}`);
      const fileUpload = await client.files.create({
        file: file as File, // Node streams are handled automatically by OpenAI SDK
        purpose: "assistants",
      });

      input.file_ids = [fileUpload.id];
    }

    // Run the Agent Builder workflow using direct API call
    // Note: The workflows API may require a newer SDK version or direct REST API calls
    const workflowId = process.env.CHATKIT_WORKFLOW_ID!;
    
    // Use the REST API directly for workflows
    const apiBase = process.env.CHATKIT_API_BASE ?? "https://api.openai.com";
    const runResponse = await fetch(`${apiBase}/v1/workflows/runs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Beta": "chatkit_beta=v1",
      },
      body: JSON.stringify({
        workflow_id: workflowId,
        input,
      }),
    });

    if (!runResponse.ok) {
      const errorData = await runResponse.json().catch(() => ({}));
      console.error("Workflow run creation failed:", errorData);
      throw new Error(errorData.error?.message ?? `Failed to create workflow run: ${runResponse.statusText}`);
    }

    const run = await runResponse.json();
    console.log(`Workflow run created: ${run.id}`);

    // Wait for the workflow to complete
    const runId = run.id;
    let runResult;
    let attempts = 0;
    const maxAttempts = 60; // 60 seconds timeout

    while (attempts < maxAttempts) {
      const statusResponse = await fetch(`${apiBase}/v1/workflows/runs/${runId}`, {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "OpenAI-Beta": "chatkit_beta=v1",
        },
      });

      if (!statusResponse.ok) {
        throw new Error(`Failed to get run status: ${statusResponse.statusText}`);
      }

      runResult = await statusResponse.json();
      
      if (runResult.status === "completed") {
        break;
      } else if (runResult.status === "failed" || runResult.status === "cancelled") {
        throw new Error(`Workflow run ${runResult.status}: ${runResult.error?.message ?? "Unknown error"}`);
      }

      // Wait 1 second before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error("Workflow run timed out");
    }

    // Return the output text (assuming your workflow outputs {output_text})
    const output = runResult.output?.output_text ?? runResult.output_text ?? JSON.stringify(runResult.output, null, 2);
    return NextResponse.json({ text: output });

  } catch (error: unknown) {
    console.error("Error in /api/chat:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

