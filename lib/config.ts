import { ColorScheme, StartScreenPrompt, ThemeOption } from "@openai/chatkit";

const FALLBACK_WORKFLOW_ID =
  "wf_68ee779f364081909c07b081c300369f0558624bf784741f";

const envWorkflowId = process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID?.trim();

export const WORKFLOW_ID =
  envWorkflowId && envWorkflowId !== "wf_..."
    ? envWorkflowId
    : FALLBACK_WORKFLOW_ID;

export const CREATE_SESSION_ENDPOINT = "/api/create-session";

export const STARTER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "Houten trap onderhouden",
    prompt:
      "Welke stappen moet ik volgen om mijn houten trap grondig te onderhouden?",
  },
  {
    label: "Lak beschadigd",
    prompt:
      "De lak van mijn Vermeulen-trap is beschadigd. Hoe herstel ik dit het beste?",
  },
];

export const PLACEHOLDER_INPUT = "Stel hier je onderhoudsvraag.";

export const GREETING =
  "Onderhoudsassistent Trappenfabriek Vermeulen.\u2028Ik ben Corne, waarmee kan ik helpen?";

const FONT_SOURCES: NonNullable<ThemeOption["typography"]>["fontSources"] = [
  {
    family: "OpenAI Sans",
    src: "https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Regular.woff2",
    weight: 400,
    style: "normal",
    display: "swap",
  },
  {
    family: "OpenAI Sans",
    src: "https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Medium.woff2",
    weight: 500,
    style: "normal",
    display: "swap",
  },
  {
    family: "OpenAI Sans",
    src: "https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Semibold.woff2",
    weight: 600,
    style: "normal",
    display: "swap",
  },
  {
    family: "OpenAI Sans",
    src: "https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Bold.woff2",
    weight: 700,
    style: "normal",
    display: "swap",
  },
];

export const getThemeConfig = (theme: ColorScheme): ThemeOption => {
  const isDark = theme === "dark";

  return {
    radius: "pill",
    density: "normal",
    color: {
      grayscale: {
        hue: 0,
        tint: 0,
        shade: isDark ? -4 : 0,
      },
      accent: {
        primary: "#DA6A2F",
        level: 1,
      },
      surface: {
        background: isDark ? "#14181d" : "#ffffff",
        foreground: isDark ? "#0f1114" : "#ffffff",
      },
    },
    typography: {
      baseSize: 16,
      fontFamily:
        '"OpenAI Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
      fontFamilyMono:
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace',
      fontSources: FONT_SOURCES,
    },
  };
};
