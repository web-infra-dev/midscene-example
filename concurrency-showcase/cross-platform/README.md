# Cross-platform Concurrency

[All examples](../README.md)

Start with **[cases/todo.yaml](./cases/todo.yaml)**: six readable flows—create, edit, complete, filter, delete and clear completed. The same file runs on Web, Android and iOS: 18 executions across three concurrent platforms. Uses public TodoMVC without a local server.

Official docs: [Multiple Projects](https://midscenejs.com/midscene-test/configuration#configure-multiple-execution-projects) and [Concurrency limits](https://midscenejs.com/midscene-test/configuration#concurrency-and-isolation).

Requires Node `^20.19.0 || ^22.12.0 || >=24.0.0` and pnpm:

```sh
pnpm install
pnpm exec playwright install chromium
cp .env.example .env
```

Fill in model settings, `ANDROID_DEVICE_ID`, and `WDA_BASE_URL`. Start WebDriverAgent for iOS; use `adb devices -l` for Android. An existing repository-root `.env` is an optional fallback. `HEADLESS=false` shows Web windows.

```sh
pnpm start
pnpm start --project web
SERIAL=1 pnpm start
```

`pnpm test` also runs the YAML business cases; there are no project unit tests.

`midscene.config.ts` directly lists Projects, YAML paths and concurrency limits. Each target runs at most one file at a time. `setup.ts` only connects platforms, opens the page and releases resources; business actions, resets and visual assertions are in YAML.

The native Midscene report contains results and screenshots. Its path is printed after each run; the default directory is `midscene_run/report/`. Edit YAML to change the TodoMVC URL or case steps.
