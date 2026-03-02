# HarmonyOS demo (vitest)

This is a demo to show how to use HDC to control HarmonyOS devices for automation tasks.

## Steps

### Preparation

Create `.env` file

```shell
# Replace with your own API key
MIDSCENE_MODEL_BASE_URL="https://.../compatible-mode/v1"
MIDSCENE_MODEL_API_KEY="sk-abcdefghijklmnopqrstuvwxyz"
MIDSCENE_MODEL_NAME="qwen3-vl-plus"
MIDSCENE_MODEL_FAMILY="qwen3-vl"
```

Connect a HarmonyOS device with [HDC](https://developer.huawei.com/consumer/en/doc/harmonyos-guides-V5/ide-hdc-V5)

Refer to this document if you want to use other models like Qwen: https://midscenejs.com/model-strategy.html

### Install

```bash
npm install
```

### Run

case1: Settings page scroll demo

```bash
npm run test -- setting.test.ts
```

case2: Todo app demo

```bash
npm run test -- todo.test.ts
```

## Reference

https://midscenejs.com/harmony-api-reference
