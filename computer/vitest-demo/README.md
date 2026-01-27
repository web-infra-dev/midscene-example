# Computer Vitest Demo

This is a demo to show how to integrate `@midscene/computer` with Vitest for PC desktop automation testing.

## Steps

### Preparation

Create `.env` file:

```shell
# Replace with your own API key
OPENAI_API_KEY="sk-your-api-key"

# Or use other models like Qwen
MIDSCENE_MODEL_NAME="qwen3-vl-plus"
```

Refer to this document if you want to use other models: https://midscenejs.com/model-provider.html

### Run tests

```bash
npm install

npm run test
```

## Reference

- https://midscenejs.com/computer-getting-started.html
- https://midscenejs.com/computer-api-reference.html
