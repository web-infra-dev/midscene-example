# Remote Playwright Demo with Midscene

This demo shows how to connect Midscene Agent to a remote browser using Playwright's CDP (Chrome DevTools Protocol) WebSocket connection.

## Use Cases

- Connect to browsers running in cloud services ([BrowserBase](https://browserbase.com), [Browserless](https://browserless.io), etc.)
- Integrate with custom browser infrastructure
- Run tests on remote browser instances
- Use browsers in containerized environments

## Prerequisites

- Node.js (v18 or higher)
- A remote browser service that provides CDP WebSocket URL
- Your AI provider API key (if required)

## Setup

1. Install dependencies:

```bash
pnpm install
# or
npm install
```

2. Configure your environment variables in `.env`:

```env
CDP_WS_URL=ws://your-remote-browser.com/devtools/browser/your-session-id
```

### Getting a CDP WebSocket URL

You can get a CDP WebSocket URL from various sources:

- **BrowserBase**: Sign up at https://browserbase.com and get your CDP URL
- **Browserless**: Use https://browserless.io or run your own instance
- **Local Chrome**: Run Chrome with `--remote-debugging-port=9222` and use `ws://localhost:9222/devtools/browser/...`
- **Docker**: Run Chrome in a Docker container with debugging port exposed

## Run the Demo

```bash
pnpm test
# or
npm test
```

## What This Demo Does

1. Connects to a remote browser using CDP WebSocket
2. Navigates to eBay
3. Searches for "Headphones"
4. Extracts product information using AI queries
5. Performs assertions and interactions
6. Demonstrates various Midscene Agent capabilities

## Key Differences from Local Playwright

Instead of launching a local browser:
```typescript
const browser = await chromium.launch();
```

We connect to a remote browser:
```typescript
const browser = await chromium.connectOverCDP(cdpWsUrl);
const context = browser.contexts()[0];
const page = context.pages()[0] || await context.newPage();
```

## Learn More

- [Midscene Documentation](https://midscenejs.com)
- [Playwright CDP Connection](https://playwright.dev/docs/api/class-browsertype#browser-type-connect-over-cdp)
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)
