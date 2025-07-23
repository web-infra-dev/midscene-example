# Playwright Demo

This is a demo to show how to use Playwright to do some automation tasks.

If you want to use Playwright with Vitest, please refer to [puppeteer-with-vitest-demo](../puppeteer-with-vitest-demo) for the usage.

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

# run extract-data.ts
npx tsx extract-data.ts

# run demo with a `.runYaml` call
npx tsx demo-run-yaml.ts
```

# Reference 

https://midscenejs.com/integrate-with-playwright.html
https://midscenejs.com/api.html
