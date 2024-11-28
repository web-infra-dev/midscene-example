# playwright-demo

> quick start

create `.env` file

```shell
# replace by your own
OPENAI_API_KEY="YOUR_TOKEN"
```

> e2e command


```bash
pnpm install --no-frozen-lockfile

# run e2e test
pnpm run e2e

# prefer using cache
pnpm run e2e:cache

# run e2e with playwright ui, remember to click the little "Play" button on the upper-left corner
pnpm run e2e:ui

# run e2e with playwright ui + cache
pnpm run e2e:ui:cache

# read report
# You must run the pnpm run e2e or pnpm e2e:cache to view the report
node ./midscene_run/midscene-report/index.js
```


# Reference 

https://midscenejs.com/integrate-with-playwright.html
https://midscenejs.com/api.html
