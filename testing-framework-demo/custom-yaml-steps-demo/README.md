# Custom YAML Steps Demo

This demo shows how a testing-framework project can add a small set of project-specific YAML steps without defining a full custom YAML format.

The important parts are:

- `midscene.config.ts` registers `yamlSteps`.
- Custom step handlers receive the YAML value and a small execution context.
- Handlers validate their own input and throw normal errors when something is wrong.
- Built-in Midscene steps such as `aiAct` and `aiAssert` still run as usual.

## Files

- `midscene.config.ts` declares the Web target and registers `seedOrder` and `assertOrderStatus`.
- `e2e/order-details.yaml` mixes custom project steps with built-in Midscene steps.
- `run-suite.ts` is a tiny local runner for this design-stage demo.
- `../public/` is the shared demo website used by the testing framework demos.

## Run

Create a `.env` file with your model settings:

```ini
MIDSCENE_MODEL_BASE_URL="https://.../compatible-mode/v1"
MIDSCENE_MODEL_API_KEY="sk-..."
MIDSCENE_MODEL_NAME="qwen3-vl-plus"
MIDSCENE_MODEL_FAMILY="qwen3-vl"
```

Install dependencies:

```bash
npm install
```

Start the demo website in one terminal:

```bash
npm run site
```

Run the Midscene suite in another terminal:

```bash
npm test
```

For a visible browser:

```bash
npm run test:headed
```

The custom steps in this demo intentionally do not use a schema helper. They check values inside the handler, which keeps the framework extension point small and leaves validation style to the project.
