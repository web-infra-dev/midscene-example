# iOS Demo

This is a demo to show how to use iOS to do some automation tasks.

If you want to use iOS with Vitest, please refer to [ios-with-vitest-demo](../vitest-demo).

## Steps

### Preparation

create `.env` file

```shell
# replace by your gpt-4o api key
OPENAI_API_KEY="YOUR_TOKEN"
```

Refer to this document if your want to use other models like Qwen: https://midscenejs.com/choose-a-model

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
