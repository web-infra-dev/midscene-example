> Midscene x adb is still under development. You may use this demo if you want to have an early access.

# Android demo

This is a demo to show how to use adb to control android to do some automation tasks.

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

connect an Android device with [adb](https://developer.android.com/tools/adb)

Refer to this document if your want to use other models like Qwen: https://midscenejs.com/model-strategy.html

### Install

install deps

```bash
npm install 
```

### Run

case1:

```bash
npm run test -- setting.test.ts
```

or case2:

```
npm run test -- todo.test.ts
```

# Reference 

https://midscenejs.com/api