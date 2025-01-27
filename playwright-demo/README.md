# playwright-demo

## Steps

create `.env` file

```shell
# replace by your own
OPENAI_API_KEY="YOUR_TOKEN"
```

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
