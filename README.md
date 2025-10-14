# Corne – Onderhoudsassistent Trappenfabriek Vermeulen

Deze Next.js-app embedt de workflow `wf_68ee779f364081909c07b081c300369f0558624bf784741f` vanuit Agent Builder in een ChatKit-widget met de branding van Trappenfabriek Vermeulen. Gebruik deze repo om lokale wijzigingen te testen en vervolgens door te zetten naar Netlify.

## Installatie
- `npm install`
- Kopieer `.env.example` naar `.env.local` en vul je **project-specifieke** `OPENAI_API_KEY` in (zelfde organisatie/project als de workflow).
- Optioneel: overschrijf `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` wanneer je in de toekomst naar een andere workflow wilt verwijzen. Zonder override wordt de Vermeulen-workflow uit de fallback geladen.

## Ontwikkelen
- `npm run dev` start de app op `http://localhost:3000`.
- De instellingen voor prompts, thema, plaatsaanduiding en wording vind je in `lib/config.ts`.
- `components/ChatKitPanel.tsx` bevat de integratie met ChatKit, inclusief sessie-aanmaak.
- De pagina-opmaak en copy worden opgebouwd in `app/App.tsx`.

## Deployen naar Netlify
1. Maak een nieuwe site in Netlify en wijs deze repository toe.
2. Voeg onder **Site settings → Environment variables** minstens `OPENAI_API_KEY` toe. Zet indien gewenst ook `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` wanneer je van de fallback wilt afwijken.
3. Stel het build-commando in op `npm run build` en de publish directory op `.next`.
4. Voeg het Netlify-domein toe aan de [OpenAI domain allowlist](https://platform.openai.com/settings/organization/security/domain-allowlist) voordat je live gaat.

## Extra tips
- Het thema van de widget komt uit de instellingen in `lib/config.ts` en kan 1-op-1 worden bijgewerkt vanuit ChatKit Studio.
- De foutoverlay en fallbackmeldingen zijn vertaald naar het Nederlands; pas teksten aan via `components/ErrorOverlay.tsx` en `components/ChatKitPanel.tsx`.
- Voeg eigen tooling of analytics toe via de callbacks `onWidgetAction` en `onResponseEnd` in `app/App.tsx`.
