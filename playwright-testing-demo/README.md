# playwright-testing-demo

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

run e2e test

```bash
pnpm install

# run e2e test
pnpm run e2e

# prefer using cache
pnpm run e2e:cache

# run e2e with playwright ui, remember to click the little "Play" button on the upper-left corner
pnpm run e2e:ui

# run e2e with playwright ui + cache
pnpm run e2e:ui:cache
```

After the above command executes successfully, the console will output: `Midscene - report file updated: ./current_cwd/midscene_run/report/some_id.html.` You can open this file in a browser to view the report.

# Reference 

https://midscenejs.com/integrate-with-playwright.html
https://midscenejs.com/api.html
