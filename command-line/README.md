# command line

## Preparation

Ensure that Node.js is installed

```shell
npm i -g @midscene/cli
```

Config the API key

```shell
# replace by your own
export OPENAI_API_KEY="sk-abcdefghijklmnopqrstuvwxyz"
```

## Run

```shell
# Extract status info from github status page
./extract-github-status.sh

# A testing case on sauce demo, expect to throw error
./sauce-demo-expect-fail.sh

# Perform a search on ebay.com, headed mode (i.e. you can see the browser window when running)
./search-headphone-on-ebay.sh
```

# Reference

A complete guide: https://midscenejs.com/cli.html
