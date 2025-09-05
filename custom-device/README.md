# Demo - Register a customized device

This is a demo to show how to define a device (interface) into Midscene.

## Steps

### Preparation

create `.env` file

```shell
# replace by your gpt-4o api key
OPENAI_API_KEY="YOUR_TOKEN"
```

Refer to this document if your want to use other models like Qwen: https://midscenejs.com/choose-a-model

### Implement the device

Refer to `mock-device.ts` for the implementation.

### Run demo

```bash
# install dependencies
npm install 

# build the device module
npm run build

# run demo.ts (javascript demo)
npx tsx demo.ts

# run cli with yaml scripts
npx midscene ./demo/run.yaml
```