# puppeteer-demo

> quick start

create `.env` file

```shell
# replace by your own
export OPENAI_API_KEY="sk-abcdefghijklmnopqrstuvwxyz"
```

> e2e command


```bash
npm install 

# run e2e test
npm run e2e

# prefer using cache
npm run e2e:cache

# run e2e with playwright ui
npm run e2e:ui

# run e2e with playwright ui + cache
npm run e2e:ui:cache


# read report
# You must run the pnpm run e2e or pnpm e2e:cache to view the report
node ./midscene_run/midscene-report/index.js
```
