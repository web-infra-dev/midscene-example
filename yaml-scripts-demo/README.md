# Yaml Scripts


## Preparation

create `.env` file

```shell
# Replace with your own API key
MIDSCENE_MODEL_BASE_URL="https://.../compatible-mode/v1"
MIDSCENE_MODEL_API_KEY="sk-abcdefghijklmnopqrstuvwxyz"
MIDSCENE_MODEL_NAME="qwen3-vl-plus"
MIDSCENE_MODEL_FAMILY="qwen3-vl"

Refer to this document if your want to use other models like Qwen: https://midscenejs.com/model-strategy.html

## Install

Ensure that Node.js is installed. Install the `@midscene/cli` globally

```shell
npm i -g @midscene/cli
```

## Run

Run all scripts

> For windows, you need to replace `./` with `.\`, like `midscene .\midscene-scripts\`.

```shell
midscene ./midscene-scripts/
```

Extract status info from github status page

```shell
midscene ./midscene-scripts/extract-github-status.yaml
```

Perform a testing case on sauce demo

```shell
midscene ./midscene-scripts/sauce-demo.yaml
```

Perform a search on ebay.com

```shell
midscene ./midscene-scripts/search-headphone-on-ebay.yaml
```

Serve the `server_root` folder as a static server and test the `index.html` file

```shell
midscene ./midscene-scripts/local-static-server.yml
```

## Debug

Run a script with headed mode (i.e. you can see the browser window when running)

```shell
midscene --headed ./midscene-scripts/sauce-demo.yaml
```

Keep the browser window open after the script finishes

```shell
midscene --keep-window ./midscene-scripts/sauce-demo.yaml
```

# Reference

https://midscenejs.com/automate-with-scripts-in-yaml.html