# Playwright with Vitest Demo

This is a demo to show how to use Playwright with Vitest and [Midscene](https://midscenejs.com/) to test AI actions and assertions.

> This demo project was scaffolded using the [vitest-midscene](https://github.com/web-infra-dev/midscene-skills) skill

## Steps

### Preparation

Create a `.env` file:

```env
# Replace with your own API key
MIDSCENE_MODEL_BASE_URL="YOUR_MODEL_BASE_URL"
MIDSCENE_MODEL_API_KEY="YOUR_MODEL_API_KEY"
MIDSCENE_MODEL_NAME="YOUR_MODEL_NAME"
MIDSCENE_MODEL_FAMILY="YOUR_MODEL_FAMILY"
```

### Install dependencies

```bash
npm install
```

### Run tests

```bash
# Run all tests
npm run test

# Run web tests only
npm run test:web
```

## Project Structure

```
├── e2e/
│   └── web/
│       └── todo-list.test.ts   # TodoMVC E2E test using Midscene
├── src/                        # Helper functions to run test
├── vitest.config.ts
└── package.json
```

## Reference

- https://midscenejs.com/integrate-with-playwright.html
- https://midscenejs.com/api.html
