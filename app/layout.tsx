import Script from "next/script";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentKit demo",
  description: "Demo of ChatKit with hosted workflow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
          strategy="beforeInteractive"
        />
        <Script id="suppress-console-errors" strategy="beforeInteractive">
          {`
            // Suppress known analytics and extension errors
            if (typeof window !== 'undefined') {
              const originalError = console.error;
              console.error = function(...args) {
                const message = args.join(' ');
                // Skip Mixpanel and extension-related errors
                if (
                  message.includes('mixpanel.com') ||
                  message.includes('ERR_BLOCKED_BY_CLIENT') ||
                  message.includes('runtime.lastError') ||
                  message.includes('message port closed') ||
                  message.includes('api-js.mixpanel.com')
                ) {
                  return;
                }
                originalError.apply(console, args);
              };
            }
          `}
        </Script>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
