# Demo - Register a customized device

This is a demo to show how to define a device (interface) into Midscene.

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

### Implement the device

Refer to `mock-device.ts` for the implementation.

### Run demo

```bash
# install dependencies
npm install 

# build the device module
npm run build

# run demo.ts (javascript demo)
npx tsx demo/run.ts

# run cli with yaml scripts
npx midscene ./demo/run.yaml
```