# Computer YAML Scripts Demo

This demo shows how to use YAML scripts for PC desktop automation with `@midscene/computer`.

## Preparation

Create `.env` file:

```shell
# Replace with your own API key
OPENAI_API_KEY="sk-your-api-key"

# Or use other models like Qwen
MIDSCENE_MODEL_NAME="qwen3-vl-plus"
```

Refer to this document if you want to use other models: https://midscenejs.com/model-provider.html

## Install

```shell
npm install
```

Or install `@midscene/cli` globally:

```shell
npm i -g @midscene/cli
```

## Run

Run all scripts:

```shell
midscene ./midscene-scripts/
```

Query screen information:

```shell
midscene ./midscene-scripts/screen-info.yaml
```

Run shop demo (login and add to cart):

```shell
midscene ./midscene-scripts/shop-demo.yaml
```

Run todo app demo:

```shell
midscene ./midscene-scripts/todo-demo.yaml
```

## Platform Notes

The demo scripts use macOS commands (Cmd+Space, Safari). For Windows, modify the scripts to use:
- `press Windows key` instead of `press Cmd+Space`
- `type "Chrome"` instead of `type "Safari"`
- `press Ctrl+L` instead of `press Cmd+L`

## Reference

- https://midscenejs.com/computer-getting-started.html
- https://midscenejs.com/automate-with-scripts-in-yaml.html
