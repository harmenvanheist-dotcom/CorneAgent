import Script from "next/script";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onderhoudsassistent Trappenfabriek Vermeulen",
  description:
    "Vraag Corne, de onderhoudsassistent van Trappenfabriek Vermeulen, om advies over reiniging, inspectie en herstel van jouw trap.",
  metadataBase: new URL("https://www.vermeulentrappen.nl"),
  openGraph: {
    title: "Corne – Onderhoudsassistent Trappenfabriek Vermeulen",
    description:
      "Direct onderhoudsadvies op maat voor trappen van Trappenfabriek Vermeulen.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Corne – Onderhoudsassistent Trappenfabriek Vermeulen",
    description:
      "Krijg onderhoudstips, inspectiestappen en hersteladvies voor jouw Vermeulen-trap.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        <Script
          src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
