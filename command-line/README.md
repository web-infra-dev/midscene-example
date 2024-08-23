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

# Perform a search on ebay.com
./search-headphone-on-ebay.sh

# A testing case on sauce demo
./sauce-demo-expect-fail.sh
```

# Reference

A complete guide: https://midscenejs.com/docs/usage/cli.html