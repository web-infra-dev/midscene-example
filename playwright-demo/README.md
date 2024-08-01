# playwright-playground

> quick start

1. create `.env` file

```md
export MIDSCENE_OPENAI_INIT_CONFIG_JSON='{"baseURL":"https://api.openai.com/v1/chat/completions","apiKey":"your-api-key"}'
export MIDSCENE_MODEL_NAME='gpt-4o'
```

> e2e command


```bash
# You need to run the pnpm install command in the Top-level directory
pnpm install 

pnpm run e2e
# Priority read cache
pnpm run e2e:cache

# with ui
pnpm run e2e:ui
pnpm run e2e:ui:cache


# read report
# You must run the pnpm run e2e or pnpm e2e:cache to view the report
node ./midscene_run/midscene-report/index.js
```
