# Midscene Examples

Examples for [Midscene.js](https://github.com/web-infra-dev/midscene).

## Examples

Here are some examples you can refer to:

### Midscene Test

Runnable examples for the [Midscene Test framework](./midscene-test/).

- [Parallel cross-platform tests](./midscene-test/parallel-cross-platform-tests/): Run the same TodoMVC flows concurrently on Web, Android and iOS. [YAML cases](./midscene-test/parallel-cross-platform-tests/cases/todo.yaml).
- [Run large suites in parallel](./midscene-test/run-large-suites-in-parallel/): Distribute a large TodoMVC suite across independent targets and compare serial/parallel execution. [YAML template](./midscene-test/run-large-suites-in-parallel/cases/todo.yaml).
- [Collaborate between platforms](./midscene-test/collaborate-between-platforms/): Create a Todo on a phone, complete it in the Web admin and verify the update on the phone within one case. [YAML case](./midscene-test/collaborate-between-platforms/cases/handoff.yaml).

### Web Browser
- [Automate with Scripts in YAML](./yaml-scripts-demo/): Automate with scripts in YAML. This is the easiest way to integrate Midscene with your existing project.
- [Integrate with Playwright](./playwright-demo/): Integrate Midscene with Playwright, including ai action, query ,cache, and report.
- [Integrate with Puppeteer](./puppeteer-demo/): Integrate Midscene with Puppeteer, including ai action, query, cache, and report.
- [Integrate with Puppeteer and Vitest](./puppeteer-with-vitest-demo/): Integrate Midscene with Puppeteer and Vitest. This is an alternative way to do test without Playwright.
- [Bridge Mode](./bridge-mode-demo/): Bridge Mode allow you to use Midscene with your Desktop Chrome.

### Android
- [JavaScript SDK Demo](./android/javascript-sdk-demo/): Integrate Midscene with Android, including ai action, query, cache, and report.
- [Vitest Demo](./android/vitest-demo/): Integrate Midscene with Android and Vitest.
- [YAML Scripts Demo](./android/yaml-scripts-demo/): Automate Android with scripts in YAML. This is the easiest way to integrate Midscene with your existing Android project.

### Computer
- [JavaScript SDK Demo](./computer/javascript-sdk-demo/): Integrate Midscene with your local desktop through `@midscene/computer`.
- [Vitest Demo](./computer/vitest-demo/): Integrate Midscene with `@midscene/computer` and Vitest.
- [Electron Demo](./computer/electron-demo/): Use Midscene with an Electron app.
- [YAML Scripts Demo](./computer/yaml-scripts-demo/): Automate desktop tasks with scripts in YAML.
- [RDP Demo](./computer/rdp-demo/): Control a remote Windows desktop directly over the RDP protocol.

## Connectivity Test

- [Connectivity Test](./connectivity-test/): Use this folder to test the connectivity of the LLM Service.

## Feedback

To open a issue, please go to [https://github.com/web-infra-dev/midscene/issues](https://github.com/web-infra-dev/midscene/issues).
