# Vitest All Platforms Demo

This demo shows how to use **Vitest + Midscene** to write AI-driven E2E tests across **Web**, **Android**, and **iOS** platforms from a single project.

> This demo project was scaffolded using the [Midscene Skills](https://github.com/web-infra-dev/midscene-skills) skill.

## Preparation

Copy `.env.example` to `.env` and fill in your model configuration:

```env
# Replace with your own AI model config
MIDSCENE_MODEL_BASE_URL="YOUR_MODEL_BASE_URL"
MIDSCENE_MODEL_API_KEY="YOUR_MODEL_API_KEY"
MIDSCENE_MODEL_NAME="YOUR_MODEL_NAME"
MIDSCENE_MODEL_FAMILY="YOUR_MODEL_FAMILY"
```

Install dependencies:

```bash
npm install
```

### Platform-specific prerequisites

- **Web**: No extra setup needed — Playwright Chromium is used automatically.
- **Android**: Connect a device (or start an emulator) and ensure `adb devices` lists it. Optionally set `MIDSCENE_ADB_PATH`, `MIDSCENE_ADB_REMOTE_HOST`, `MIDSCENE_ADB_REMOTE_PORT` in `.env`.
- **iOS**: Ensure [WebDriverAgent](https://github.com/appium/WebDriverAgent) is running on the target device/simulator. WDA port defaults to 8100 and can be overridden via `IOSTest.setup()` options.

## Run tests

```bash
# Run all platform tests
npm run test

# Run web tests only
npm run test:web

# Run Android tests only
npm run test:android

# Run iOS tests only
npm run test:ios

# Open Vitest UI
npm run test:ui
```

## What modules are included

```text
├── e2e/
│   ├── web/
│   │   └── baidu-search.test.ts
│   ├── android/
│   │   └── todo.test.ts
│   └── ios/
│       └── todo.test.ts
├── src/
│   ├── context/
│   │   ├── base.ts
│   │   ├── index.ts
│   │   ├── web.ts
│   │   ├── android.ts
│   │   └── ios.ts
│   ├── report-helper.ts
│   ├── reporter.ts
│   └── utils.ts
├── vitest.config.ts
└── package.json
```

### `e2e/web/baidu-search.test.ts`

- Demo web E2E test that searches on Baidu.
- Uses `WebTest.setup()` to manage Playwright browser lifecycle automatically.
- Demonstrates `aiAct` for natural-language UI interactions.

### `e2e/android/todo.test.ts`

- Demo Android E2E test on TodoMVC (opened in device browser).
- Uses `AndroidTest.setup()` to manage ADB device connection and app launching.
- Demonstrates `aiAct` and `aiQuery` for driving and querying mobile UI.

### `e2e/ios/todo.test.ts`

- Demo iOS E2E test on TodoMVC (opened in device browser).
- Uses `IOSTest.setup()` to manage WDA device connection and app launching.
- Same test logic as the Android demo, showing cross-platform portability.

### `src/context/*`

- `web.ts`: `WebTest` context — manages Playwright browser/page lifecycle and creates `PlaywrightAgent` per test.
- `android.ts`: `AndroidTest` context — manages ADB device connection and creates `AndroidAgent` per test.
- `ios.ts`: `IOSTest` context — manages WDA device connection and creates `IOSAgent` per test.
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

## References

- https://midscenejs.com/integrate-with-playwright.html
- https://midscenejs.com/android.html
- https://midscenejs.com/ios.html
- https://midscenejs.com/api.html
