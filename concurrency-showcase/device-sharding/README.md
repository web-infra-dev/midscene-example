# Device Sharding

[All examples](../README.md)

Start with **[cases/todo.yaml](./cases/todo.yaml)**. All six flows and assertions live in this template; `CASE_ID` is a title placeholder. `generate.ts` only substitutes IDs, selects one case, and distributes files across the three targets. It does not define business steps.

Official docs: [File concurrency](https://midscenejs.com/midscene-test/configuration#file-concurrency-with-maxconcurrentfiles) and [File isolation](https://midscenejs.com/midscene-test/configuration#isolate-resources-with-filesetup).

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
CASE_COUNT=30 pnpm start
pnpm start                         # 300 cases
CASE_COUNT=1000 pnpm start
CASE_COUNT=30 SERIAL=1 pnpm start   # same assignment, serial execution
pnpm generate 300                  # inspect YAML without devices/model calls
```

Generated files are in `generated/web/`, `generated/android/`, and `generated/ios/`. With 300 cases, each target receives 100; each file has one case, executed once. These are parameterized examples of six flows, not 300 different business flows. Editing the template changes the next generation.

`midscene.config.ts` directly lists each target's directory and concurrency limits. Each device runs one file at a time. `setup.ts` connects/releases platforms; YAML owns all business behavior. Uses public TodoMVC with no local server.

`pnpm test` runs the YAML suite, with no project unit tests. Use the printed native report path for outcomes, screenshots and timing; default `midscene_run/report/`. To add devices, add real device Projects and update the generator's target list. Browser sessions are not physical devices.
