# Mixed-platform Collaboration

[All examples](../README.md)

Start with **[cases/handoff.yaml](./cases/handoff.yaml)**: phone creates → Web admin completes → phone observes synchronization. One YAML case explicitly calls `mobile.aiAct`, `web.aiTap`, and visual assertions on both sides.

Official docs: [Concurrency limits](https://midscenejs.com/midscene-test/configuration#concurrency-and-isolation) and [Execution order](https://midscenejs.com/midscene-test/use#execution-order-and-retries).

Requires Node `^20.19.0 || ^22.12.0 || >=24.0.0` and pnpm:

```sh
pnpm install
pnpm exec playwright install chromium
cp .env.example .env
```

Fill in model settings, `ANDROID_DEVICE_ID`, and `WDA_BASE_URL`. Start WebDriverAgent for iOS; use `adb devices -l` for Android. An existing repository-root `.env` is an optional fallback. `HEADLESS=false` shows Web windows.

```sh
pnpm start
pnpm start --project ios-web
SERIAL=1 pnpm start
```

Public TodoMVC stores data in localStorage, so this example starts a minimal shared LAN service. Phones must reach this computer. Set `SHOWCASE_LAN_HOST` / `SHOWCASE_PORT` if needed; Android emulators use `10.0.2.2`. `pnpm serve` runs the service separately for manual inspection.

- `midscene.config.ts`: two explicit Projects and concurrency limits.
- `setup.ts`: a phone and its separate Web admin session.
- `nodes.ts`: isolated workspace lifecycle, `mobile.*` / `web.*` registration, and record-ID checks.
- `run.ts`: starts the service, invokes native Midscene CLI, then closes the service.
- `server/` and `public/`: shared Todo service and page.

Creation/completion happen through AI UI operations in YAML. API checks only confirm record identity. Each case has a fresh workspace, deleted on cleanup; the phone sees updates without refresh. To change the title, edit the YAML steps and `todo.captureId` argument together.

`pnpm test` runs the business YAML, with no project unit tests. Both Agents' screenshots, traces and outcomes appear in the same native case report. The path is printed after the run; default `midscene_run/report/`.
