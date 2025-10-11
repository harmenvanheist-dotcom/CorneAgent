# ChatKit Starter Template

This repository is the simplest way to bootstrap a [ChatKit](http://openai.github.io/chatkit-js/) application. It ships with a minimal Next.js UI, the ChatKit web component, and a ready-to-use session endpoint so you can experiment with OpenAI-hosted workflows built using [Agent Builder](https://platform.openai.com/agent-builder).

## What You Get

- Next.js app with `<openai-chatkit>` web component and theming controls
- API endpoint for creating a session at [`app/api/create-session/route.ts`](app/api/create-session/route.ts)
- Quick examples for starter prompts, placeholder text, and greeting message

## Getting Started

Follow every step below to run the app locally and configure it for your preferred backend.

### 1. Install dependencies

```bash
npm install
```

### 2. Create your environment file

Copy the example file and fill in the required values:

```bash
cp .env.example .env.local
```

### 3. Configure ChatKit credentials

Update `.env.local` with the variables that match your setup.

- `OPENAI_API_KEY` — API key created **within the same org & project as your Agent Builder**
- `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` — the workflow you created in [Agent Builder](https://platform.openai.com/agent-builder)
- (optional) `CHATKIT_API_BASE` - customizable base URL for the ChatKit API endpoint

### 4. Run the app

```bash
npm run dev
```

Visit `http://localhost:3000` and start chatting. Use the prompts on the start screen to verify your workflow connection, then customize the UI or prompt list in [`lib/config.ts`](lib/config.ts) and [`components/ChatKitPanel.tsx`](components/ChatKitPanel.tsx).

### 5. Build for production (optional)

```bash
npm run build
npm start
```

### Run with Docker

Build the production image and run it locally:

```bash
docker build -t chatkit-app .
docker run --rm -p 3000:3000 --env-file .env.local chatkit-app
```

Or pass env vars explicitly:

```bash
docker run --rm -p 3000:3000 \
  -e OPENAI_API_KEY="..." \
  -e NEXT_PUBLIC_CHATKIT_WORKFLOW_ID="wf_..." \
  chatkit-app
```

Visit `http://localhost:3000`.

### Mount env file, then start service

If you prefer mounting `.env.local` rather than passing `--env-file`, the image has an entrypoint that reads `/app/.env.local` before starting:

```bash
docker run --rm -p 3000:3000 \
  -v $(pwd)/.env.local:/app/.env.local:ro \
  chatkit-app
```

### Develop inside Docker (hot reload)

Use the local development setup with bind mounts and your local env:

```bash
# Create your environment file
cp .env.example .env.local
# Edit .env.local with your OPENAI_API_KEY and NEXT_PUBLIC_CHATKIT_WORKFLOW_ID

# Start the development container
docker-compose -f docker-compose.local.yml down
docker-compose -f docker-compose.local.yml up --build
```

This runs `npm run dev` in a container with:
- Hot reload enabled (source code mounted from host)
- DNS configured for external API access
- Port 3000 exposed to host
- Environment variables loaded from `.env.local`

Visit `http://localhost:3000` and start chatting. Your code changes will trigger hot reload inside the container.

## Customization Tips

- Adjust starter prompts, greeting text, and placeholder copy in [`lib/config.ts`](lib/config.ts).
- Update the theme defaults or event handlers inside [`components/.tsx`](components/ChatKitPanel.tsx) to integrate with your product analytics or storage.

## References

- [ChatKit JavaScript Library](http://openai.github.io/chatkit-js/)
- [Advanced Self-Hosting Examples](https://github.com/openai/openai-chatkit-advanced-samples)
