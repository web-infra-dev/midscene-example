# Android Config Demo

This demo shows the proposed `midscene.config.ts` shape for Android testing framework projects.

The important parts are:

- `platform: 'android'` explicitly selects the Android runtime.
- `testRunner` keeps Rstest-aligned execution fields together.
- `agentOptions` contains shared Midscene Agent constructor options.
- `runtimeOptions` contains Android device and ADB options that used to live under `android:` in YAML files.
- `setup()` is the platform boundary: it creates the Android Agent and returns the executable `agent` instance.

## Files

- `midscene.config.ts` declares the suite and creates an Android Agent with `agentFromAdbDevice()`.
- `e2e/search-ebay.yaml` keeps only the user path.
- `run-suite.ts` is a tiny local runner for this design-stage demo.

## Run

Create a `.env` file or export model settings:

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

Connect an Android device, then run:

```bash
ANDROID_DEVICE_ID=<adb-device-id> npm test
```

Optional Android runtime settings:

```bash
ANDROID_ADB_PATH=/path/to/adb \
ANDROID_REMOTE_ADB_HOST=127.0.0.1 \
ANDROID_REMOTE_ADB_PORT=5037 \
ANDROID_LAUNCH_TARGET=https://www.ebay.com \
npm test
```

The YAML case does not include `android.deviceId`, ADB, IME, or keyboard options. Those initialization-level settings now belong in `runtimeOptions`.
