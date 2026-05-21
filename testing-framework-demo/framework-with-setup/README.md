# Framework With Setup

This demo shows the next step after a pure YAML suite: `setup.ts` owns the environment, while YAML files stay focused on user paths.

`setup.ts` does three Midscene-facing things:

- launches a Playwright Chromium browser
- injects session cookies before the page opens
- creates and returns a `PlaywrightAgent`

## Files

- `setup.ts` prepares the browser, context, page, cookies, Midscene agent, and cleanup callbacks.
- `config.yml` points the suite at `setup.ts` and lists the YAML cases.
- `run-suite.ts` is a tiny local runner that calls `setup.ts` and runs each top-level `flow` through `agent.runYaml()`.
- `e2e/checkout-returning-user.yaml` starts from the prepared catalog page.
- `e2e/support-returning-user.yaml` reuses the prepared browser session and navigates through the UI.
- `../public/` is a standalone demo website project shared by the testing framework demos.

## Run

Create a `.env` file with your model settings:

```ini
MIDSCENE_MODEL_BASE_URL="https://.../compatible-mode/v1"
MIDSCENE_MODEL_API_KEY="sk-..."
MIDSCENE_MODEL_NAME="qwen3-vl-plus"
MIDSCENE_MODEL_FAMILY="qwen3-vl"
```

Install dependencies:

```bash
npm install
```

Start the demo website in one terminal:

```bash
npm run site
```

Run the Midscene suite in another terminal:

```bash
npm test
```

For a visible browser:

```bash
npm run test:headed
```

By default `setup.ts` opens `http://127.0.0.1:3000/catalog.html`. To use another site URL:

```bash
DEMO_SITE_URL=http://127.0.0.1:4000 npm test
```
