# Playwright with Vitest Demo

This demo shows how to combine **Playwright + Vitest + Midscene** to write AI-driven E2E tests for web pages.

> This demo project was scaffolded using the [vitest-midscene](https://github.com/web-infra-dev/midscene-skills) skill.

## Preparation

Create a `.env` file:

```env
# Replace with your own API key
MIDSCENE_MODEL_BASE_URL="YOUR_MODEL_BASE_URL"
MIDSCENE_MODEL_API_KEY="YOUR_MODEL_API_KEY"
MIDSCENE_MODEL_NAME="YOUR_MODEL_NAME"
MIDSCENE_MODEL_FAMILY="YOUR_MODEL_FAMILY"
```

Install dependencies:

```bash
npm install
```

Run tests:

```bash
# Run all tests
npm run test

# Run web tests only
npm run test:web
```

## What modules are included

```text
├── e2e/
│   └── web/
│       └── todo-list.test.ts
├── src/
│   ├── context/
│   │   ├── base.ts
│   │   ├── index.ts
│   │   └── web.ts
│   ├── report-helper.ts
│   ├── reporter.ts
│   └── utils.ts
├── vitest.config.ts
└── package.json
```

### `e2e/web/todo-list.test.ts`

- Demo web E2E case on TodoMVC.
- Uses Midscene `agent` methods (`aiAct`, `aiQuery`, `aiAssert`, `aiString`, etc.) to drive and validate behavior in natural language.
- Good as a template for writing new scenario tests.

### `src/context/*`

- `web.ts`: `WebTest` context that manages Playwright browser/page lifecycle and creates Midscene `PlaywrightAgent` per test.
- `base.ts`: shared base context abstraction (common lifecycle and report integration hooks).
- `index.ts`: exports the public context API.

### `src/report-helper.ts`

- Collects per-test report data.
- Merges all test reports into one final report at suite end.
- Marks skipped/failed/timedOut/passed status.

### `src/reporter.ts`

- Custom Vitest reporter.
- Prints Midscene merged report path directly in terminal output, so developers can quickly open the report.

### `src/utils.ts`

- Shared helper: timestamp generation for report filenames.

### `vitest.config.ts`

- Test include pattern, timeout settings, and custom reporter setup.
- Loads `.env` via `dotenv/config` for model configuration.

## What the web test does

`e2e/web/todo-list.test.ts` demonstrates an end-to-end AI workflow:

1. Open TodoMVC page.
2. Add 3 todo items with `aiAct`.
3. Delete one specific item and complete another item.
4. Switch to `completed` filter.
5. Query the current list and assert expected count.
6. Assert page text (`1 item left`).
7. Extract structured data from page with `aiString`, `aiNumber`, `aiBoolean`, `aiLocate`.

This demonstrates both:

- **AI action**: controlling UI through natural-language instructions.
- **AI assertion/query**: validating UI state and reading structured information without hand-written locators.

## References

- https://midscenejs.com/integrate-with-playwright.html
- https://midscenejs.com/api.html
