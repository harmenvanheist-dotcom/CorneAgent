"use client";

import { useCallback } from "react";
import { ChatKitPanel, type FactAction } from "@/components/ChatKitPanel";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function App() {
  const { scheme, setScheme } = useColorScheme();

  const handleWidgetAction = useCallback(async (action: FactAction) => {
    if (process.env.NODE_ENV !== "production") {
      console.info("[ChatKitPanel] widget action", action);
    }
  }, []);

  const handleResponseEnd = useCallback(() => {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[ChatKitPanel] response end");
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-[#f7f3ef] text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="relative flex flex-1 flex-col">
        <div className="absolute inset-x-0 top-0 -z-10 h-44 bg-gradient-to-b from-[#ffefe2]/70 to-transparent dark:from-slate-900/90" />
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8 lg:px-10">
          <header className="flex flex-col gap-3">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#DA6A2F]">
              Vermeulen Trappen
            </span>
            <h1 className="text-3xl font-semibold sm:text-4xl">
              Onderhoudsassistent Trappenfabriek Vermeulen
            </h1>
            <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300">
              Ontvang direct onderhoudsadvies en tips op maat voor jouw
              Vermeulen-trap. Upload foto&apos;s of documenten en krijg
              concrete instructies voor inspectie, reinigen en herstel.
            </p>
          </header>

          <section className="flex-1">
            <ChatKitPanel
              theme={scheme}
              onWidgetAction={handleWidgetAction}
              onResponseEnd={handleResponseEnd}
              onThemeRequest={setScheme}
            />
          </section>

         <footer className="pb-6 text-sm text-slate-600 dark:text-slate-400">
  <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
    Over de assistent
  </h2>
  <p className="mt-1 max-w-2xl">
    Corne helpt klanten van Trappenfabriek Vermeulen met vragen over
    onderhoud, inspectie en herstellingen. Het advies is informatief
    en kan afwijkingen bevatten; controleer altijd zelf of het past
    bij jouw situatie. Deze assistent is gebouwd door{' '}
    <a 
      href="https://assistentenvanmorgen.nl" 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
    >
      Morgen Academy
    </a>.
  </p>
</footer>
        </div>
      </div>
    </main>
  );
}
