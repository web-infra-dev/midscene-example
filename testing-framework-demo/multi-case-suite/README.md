# Multi Case Suite

This demo shows a pure YAML Midscene suite: several readable cases live under `e2e/` and are executed together through `config.yml`.

## Files

- `config.yml` defines the execution order, summary output, shared viewport, and error behavior.
- `e2e/01-home-smoke.yaml` checks the home page shell and extracts KPI data.
- `e2e/02-catalog-filter.yaml` filters a local catalog page and opens product details.
- `e2e/03-support-form.yaml` fills and submits a local support form.
- `../public/` contains shared static pages that other testing framework demos can reuse.

## Run

Create a `.env` file with your model settings:

```ini
MIDSCENE_MODEL_BASE_URL="https://.../compatible-mode/v1"
MIDSCENE_MODEL_API_KEY="sk-..."
MIDSCENE_MODEL_NAME="qwen3-vl-plus"
MIDSCENE_MODEL_FAMILY="qwen3-vl"
```

Install and run:

```bash
npm install
npm test
```

For a visible browser:

```bash
npm run test:headed
```

The suite writes a JSON summary to `midscene_run/output/summary.json`, per-case query/assert outputs under `midscene_run/output/`, and Midscene HTML reports under `midscene_run/report/`.
