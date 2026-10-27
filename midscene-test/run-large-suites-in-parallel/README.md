# Run Large Suites in Parallel

[All examples](../README.md)

Start with **[cases/todo.yaml](./cases/todo.yaml)**. All six flows and assertions live in this template; `CASE_ID` is a title placeholder. `generate.ts` only substitutes IDs, selects one case, and distributes files across the three targets. It does not define business steps.

This example combines **cross-platform concurrency and file concurrency within each Project**:

| Project | Independent resources | Concurrent YAML files |
| --- | --- | ---: |
| Web | Two BrowserContexts, Pages and Midscene Agents in one shared Browser | 2 |
| Android | Two devices/emulators, with a separate Device and Midscene Agent for each active file | 2 |
| iOS | Two devices/simulators, each with its own WDA, MJPEG endpoint and Midscene Agent | 2 |

`test.maxConcurrentProjects: 3` admits all three platforms. `test.maxConcurrentFiles: 6` is the global file limit; each Project sets `maxConcurrentFiles: 2`. Up to six files can run together. Browser sessions are not physical devices, and file limits do not guarantee simultaneous model calls or a particular speedup.

Official docs: [File concurrency](https://midscenejs.com/midscene-test/configuration#file-concurrency-with-maxconcurrentfiles) and [File isolation](https://midscenejs.com/midscene-test/configuration#isolate-resources-with-filesetup).

Requires Node `^20.19.0 || ^22.12.0 || >=24.0.0` and pnpm:

```sh
pnpm install
pnpm exec playwright install chromium
cp .env.example .env
```

Fill in model settings in `.env`. An existing repository-root `.env` is an optional fallback. `HEADLESS=false` shows Web windows.

### Local device setup

The full example requires **two Android devices and two iOS devices**, plus the Web browser. Prepare your own devices before running; this example does not create or boot simulators or start WebDriverAgent (WDA). With one device per platform, use `SERIAL=1` and configure one item in each list.

- **Android:** start two emulators in Android Studio or connect two devices. Run `adb devices -l` and list their serials in `ANDROID_DEVICE_IDS`, separated by commas. Each must have status `device`. See the official [Android setup guide](https://midscenejs.com/platforms/android).
- **iOS:** start two simulators/devices and a WDA for each using the official [iOS setup guide](https://midscenejs.com/platforms/ios). List their WDA URLs in `WDA_BASE_URLS` and the corresponding MJPEG URLs in `WDA_MJPEG_URLS`, in the same order. Verify each WDA `/status` endpoint returns `value.ready: true`. Different WDA ports must connect to different devices; two endpoints for the same device do not provide isolation. On one host, use distinct WDA and MJPEG ports for each simulator.

The serials and ports in `.env.example` are **sample values**, not portable device settings or a claim that four local devices have been validated. Replace them with your own running devices. `127.0.0.1` means the computer running your tests. This example reads the plural device-list variables above; single-device settings from the other examples do not populate these pools.

Device lists are checked when the selected Project starts. Missing, duplicate or insufficient devices fail with a configuration error; Android serials and iOS endpoints are never silently reused to fill concurrency slots. Each WDA/MJPEG list must have the same number of entries. `--project web` needs no mobile device configuration.

```sh
pnpm start                         # 60 cases: 20 per platform, up to 6 files at once
CASE_COUNT=300 pnpm start
CASE_COUNT=1000 pnpm start
SERIAL=1 pnpm start                # same 60 files/platform assignment, one file globally
CASE_COUNT=6 pnpm start --project web  # Web-only smoke run, two independent sessions
pnpm generate 300                  # inspect YAML without devices/model calls
```

Generated files are in `generated/web/`, `generated/android/`, and `generated/ios/`. The default 60 cases give each target 20 files; 300 cases give each 100. Each file contains one case, assigned to exactly one platform and executed once. These are parameterized examples of six flows, not 60 different business flows. Editing the template changes the next generation.

### Resource lifecycle

- `midscene.config.ts` lists three platform Projects, each with `setup`, `fileSetup` and a file limit of two.
- Project `setup` creates a shared Browser or a device pool. `fileSetup` creates a fresh BrowserContext/Page/Agent, or leases one exclusive mobile device and creates a new Device/Agent for that file.
- File teardown destroys the Agent before closing the BrowserContext or returning the mobile device allocation. If Agent destruction fails, that device is not returned to the pool. The next file creates a new Device/Agent rather than reusing a destroyed object. The shared Browser closes after all file cleanup.
- `devices.ts` contains the small allocation pool. The Project file limit cannot exceed the configured device count, so the pool needs no extra waiting queue. To use more devices, extend the lists and raise the corresponding Project and global file limits; do not create a Project for every device.
- YAML owns all business behavior and resets TodoMVC before every case, including on reused mobile devices. Uses public TodoMVC with no local server.

### Check the concurrency

Run the same suite with and without `SERIAL=1`. `pnpm test` runs the business YAML, with no project unit tests. Use the printed native HTML report path for outcomes, screenshots and timing; default `midscene_run/report/`.

The console prints `[resource] acquired/released` with the Project, YAML filename and Android serial, iOS WDA URL or unique Web session ID. `todo.open` also records this resource identifier in its step result. A WDA URL identifies a configured connection; verify its underlying simulator/device yourself.

In the native report timeline, check both overlapping Projects and overlapping files within each Project. Match the overlapping files to different resource identifiers, and verify that the same mobile device has been released before it is assigned again. The full showcase needs observed overlap on all three platforms; successful Web-only runs or configuration checks alone do not establish mobile concurrency. Compare Run time for total elapsed time; model/API limits and setup/cleanup can prevent a sixfold speedup.

Validation for this version: the Web-only smoke run passed both files with overlapping lifetimes and distinct browser sessions. Configuration, the 60-file partition, exclusive device allocation and cancellation cleanup were checked separately. A full run with two Android and two iOS devices is still pending.
