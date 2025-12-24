# Android Demo

This is a demo to show how to use Android to do some automation tasks.

If you want to use Android with Vitest, please refer to [android-with-vitest-demo](../android-with-vitest-demo).

## Steps

### Preparation

create `.env` file

```shell
# Replace with your own API key
MIDSCENE_MODEL_BASE_URL="https://.../compatible-mode/v1"
MIDSCENE_MODEL_API_KEY="sk-abcdefghijklmnopqrstuvwxyz"
MIDSCENE_MODEL_NAME="qwen3-vl-plus"
MIDSCENE_MODEL_FAMILY="qwen3-vl"
```

Refer to this document if your want to use other models like Qwen: https://midscenejs.com/model-strategy.html

### Run demo

```bash
npm install 

# run demo.ts
npx tsx demo.ts

# run demo with a `.runYaml` call
npx tsx demo-run-yaml.ts
```

# Reference 

https://midscenejs.com/integrate-with-puppeteer.html
https://midscenejs.com/api.html
