# HarmonyOS demo (JavaScript SDK)

This is a demo to show how to use `@midscene/harmony` JavaScript SDK to control HarmonyOS devices.

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

```bash
npm test
```

## Reference

https://midscenejs.com/harmony-api-reference
