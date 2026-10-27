# Collaborate Between Platforms

[All examples](../README.md)

Start with **[cases/handoff.yaml](./cases/handoff.yaml)**: phone creates → Web admin completes → phone observes synchronization. One YAML case explicitly calls `mobile.aiAct`, `web.aiTap`, and visual assertions on both sides.

In [nodes.ts](./nodes.ts), `createMidsceneNodes()` uses `namespace: 'mobile'` and `namespace: 'web'` to register each Midscene Agent's Nodes. YAML calls those prefixed names directly. This example pins Midscene packages to `1.17.1`, which includes [namespace support](https://midscenejs.com/midscene-test/configuration#name-nodes-for-multiple-midscene-agents).

Official docs: [Concurrency limits](https://midscenejs.com/midscene-test/configuration#concurrency-and-isolation) and [Execution order](https://midscenejs.com/midscene-test/use#execution-order-and-retries).

Requires Node `^20.19.0 || ^22.12.0 || >=24.0.0` and pnpm:

```sh
pnpm install
pnpm exec playwright install chromium
cp .env.example .env
```

Fill in model settings in `.env`. An existing repository-root `.env` is an optional fallback. `HEADLESS=false` shows Web windows.

### Local device setup

Mobile validation used the author's own local Android emulator and iOS simulator on macOS. Prepare your own devices before running; this example does not create or boot simulators or start WebDriverAgent (WDA).

- **Android:** start your emulator in Android Studio or connect a device. Run `adb devices -l` and set `ANDROID_DEVICE_ID` to its serial, listed with status `device`. See the official [Android setup guide](https://midscenejs.com/platforms/android).
- **iOS:** start your simulator/device and WDA using the official [iOS setup guide](https://midscenejs.com/platforms/ios). Set `WDA_BASE_URL` to that service and verify its `/status` endpoint returns `value.ready: true`.

`emulator-5554` and `http://127.0.0.1:8100` are example defaults from the validation environment. Verify and replace them as needed; `127.0.0.1` means the computer running your tests, not the author's computer.

```sh
pnpm start
pnpm start --project ios-web
SERIAL=1 pnpm start
```

Public TodoMVC stores data in localStorage, so this example starts a minimal shared LAN service. Phones must reach this computer. Set `SHOWCASE_LAN_HOST` / `SHOWCASE_PORT` if needed; Android emulators use `10.0.2.2`. `pnpm serve` runs the service separately for manual inspection.

The automatic `10.0.2.2` routing assumes the Android emulator runs on the same computer as this example. For other devices, use your own computer's reachable LAN address; `192.168.1.10` in `.env.example` is only a sample value.

- `midscene.config.ts`: two explicit Projects and concurrency limits.
- `setup.ts`: a phone and its separate Web admin session.
- `nodes.ts`: isolated workspace lifecycle, `mobile.*` / `web.*` registration, and record-ID checks.
- `run.ts`: starts the service, invokes native Midscene CLI, then closes the service.
- `server/` and `public/`: shared Todo service and page.

Creation/completion happen through AI UI operations in YAML. API checks only confirm record identity. Each case has a fresh workspace, deleted on cleanup; the phone sees updates without refresh. To change the title, edit the YAML steps and `todo.captureId` argument together.

`pnpm test` runs the business YAML, with no project unit tests. Both Agents' screenshots, traces and outcomes appear in the same native case report. The path is printed after the run; default `midscene_run/report/`.
