# Framework With Setup

This demo shows the next step after a pure YAML suite: `midscene.config.ts` owns the project configuration and runtime setup, while YAML files stay focused on user paths.

`midscene.config.ts` does two kinds of Midscene-facing work:

- declares the suite shape: case directory, file matching, `testRunner`, shared agent options, and summary output
- prepares the runtime: launches a Playwright Chromium browser, injects session cookies, opens the page, creates a `PlaywrightAgent`, and registers teardown

This demo intentionally omits `target`. It represents the advanced path where `setup()` fully owns runtime creation. The simpler Android config demo shows the default `target: { type, options }` path.

## Files

- `midscene.config.ts` is the single config-as-code entry for case discovery, Rstest-aligned execution fields, shared Midscene agent options, browser setup, cookies, and teardown.
- `run-suite.ts` is a tiny local runner that reads `midscene.config.ts` and runs each top-level `flow` through `agent.runYaml()`.
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

By default `midscene.config.ts` opens `http://127.0.0.1:3000/catalog.html`. To use another site URL:

```bash
DEMO_SITE_URL=http://127.0.0.1:4000 npm test
```
