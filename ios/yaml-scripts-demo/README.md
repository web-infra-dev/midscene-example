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

Maps navigation demo

```shell
midscene ./midscene-scripts/maps-navigation.yaml
```

Twitter auto-like demo

```shell
midscene ./midscene-scripts/twitter-auto-like.yaml
```

Perform a search on ebay.com

```shell
midscene ./midscene-scripts/search-headphone-on-ebay.yaml
```

# Reference

https://midscenejs.com/automate-with-scripts-in-yaml.html