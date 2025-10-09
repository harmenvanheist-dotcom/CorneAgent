import { StartScreenPrompt } from "@openai/chatkit";

export const WORKFLOW_ID = process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID?.trim() ?? "";

export const CREATE_SESSION_ENDPOINT = "/api/create-session";

export const STARTER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "Eren Kılınç Youtube videoları hakkında bilgi al",
    prompt: "Eren Kılınç Youtube videoları hakkında bilgi al",
    icon: "circle-question",
  },
];

export const PLACEHOLDER_INPUT = "Eren Kılınç Youtube videoları hakkında bilgi al";

export const GREETING = "Bugün nasıl yardımcı olabilirim?";
