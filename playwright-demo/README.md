# playwright-demo

## Steps

create `.env` file

### If you want to use OpenAI GPT-4o

```shell
OPENAI_API_KEY="YOUR_TOKEN"
```

### If you want to use Qwen-2.5-VL

```shell
OPENAI_BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1" # or any endpoint from other providers.
OPENAI_API_KEY="......"
MIDSCENE_MODEL_NAME="qwen-vl-max-latest" # use this for Aliyun service
MIDSCENE_USE_QWEN_VL=1 # remember to include this for Qwen 2.5 mode
```

For more information about Model configuration, please refer to [Choose a Model](https://midscenejs.com/choose-a-model.html).


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
