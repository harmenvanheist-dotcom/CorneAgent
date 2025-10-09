import { StartScreenPrompt } from "@openai/chatkit";

export const WORKFLOW_ID = process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID?.trim() ?? "";

export const CREATE_SESSION_ENDPOINT = "/api/create-session";

export const STARTER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "O que você pode fazer?",
    prompt: "Como posso ajudar?",
    icon: "circle-question",
  },
];

export const PLACEHOLDER_INPUT = "Pergunte sobre nossos dados...";

export const GREETING = "Seu Assistente da PH3A. Como posso ajudá-lo hoje?";
