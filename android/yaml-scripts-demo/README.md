# Yaml Scripts


## Preparation

create `.env` file

```shell
# replace by your gpt-4o own
OPENAI_API_KEY="YOUR_TOKEN"
```

Refer to this document if your want to use other models like Qwen: https://midscenejs.com/choose-a-model

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