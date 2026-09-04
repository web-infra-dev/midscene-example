# Midscene Test Runner Demo

This example uses the [`@midscene/test`](https://midscenejs.com/test-runner-overview.html) Test Runner to execute Web test cases against [TodoMVC React](https://todomvc.com/examples/react/dist/).

It demonstrates the boundary between the two authoring layers:

- TypeScript Nodes provide reusable, validated capabilities and own the Playwright selectors.
- YAML cases describe business intent by composing deterministic and AI Nodes.

The deterministic Nodes prepare data and verify exact state. `aiAct` and `aiAssert` handle visual, semantic interaction. This keeps the case readable without making its final result ambiguous.

## How this example differs from nearby demos

| Example | Runner | Case format | Main purpose |
| --- | --- | --- | --- |
| [`playwright-testing-demo`](../playwright-testing-demo/) | Playwright Test | TypeScript spec | Use Midscene fixtures inside Playwright Test |
| [`playwright-with-vitest-demo`](../playwright-with-vitest-demo/) | Vitest | TypeScript test | Organize Midscene Web tests with Vitest |
| `midscene-test-runner-demo` | `@midscene/test` | YAML cases + TypeScript Nodes | Define a Test Project, extend Nodes, use lifecycle hooks, and inspect Nodes with `describe-nodes` |

This is not the legacy `@midscene/cli` YAML format shown by [`yaml-scripts-demo`](../yaml-scripts-demo/).

## Project structure

```text
midscene-test-runner-demo/
├── cases/
│   └── todo.yaml          # Workflow lifecycle and test cases
├── nodes/
│   └── todo.ts            # Reusable, deterministic TodoMVC Nodes
├── .env.example           # Model configuration template
├── midscene-nodes.md      # Generated Node contract; do not edit
├── midscene.config.ts     # Test Project, Playwright, and Agent setup
├── package.json
└── tsconfig.json
```

The example registers three custom Nodes:

- `todo.seed`: resets TodoMVC and creates items through the visible UI.
- `todo.expectState`: requires the exact ordered titles and completed states.
- `todo.captureState`: records the current DOM state from `afterEach` for diagnostics.

It also registers the Midscene Nodes (`aiAct`, `aiAssert`, `recordToReport`, and others) and the Playwright preset Nodes (`gotoUrl`, `setViewportSize`, and others).

## Quick start

This repository contains independent examples. Run the commands inside this directory:

```bash
cd midscene-test-runner-demo
pnpm install
pnpm run browser:install
```

First, inspect every Node that this Test Project exposes:

```bash
pnpm run describe:nodes
```

`describe-nodes` only loads `midscene.config.ts`. It does not launch Chromium, open TodoMVC, or require an API Key.

The complete generated reference is committed as [`midscene-nodes.md`](./midscene-nodes.md) so readers and tooling can inspect the Test Project contract without installing the example. **Never edit this file manually.** After changing Nodes, configuration, or the pinned Midscene packages, regenerate it with:

```bash
pnpm run describe:nodes:file
```

The output for a custom Node includes its description and a JSON Schema generated from Zod, for example:

```md
## `todo.seed`

**Title:** Seed the Todo list

Reset TodoMVC and create an ordered list of Todos through the visible input.
```

Next, copy the model template and fill in a valid Midscene model configuration:

```bash
cp .env.example .env
```

```env
MIDSCENE_MODEL_BASE_URL="YOUR_MODEL_BASE_URL"
MIDSCENE_MODEL_API_KEY="YOUR_MODEL_API_KEY"
MIDSCENE_MODEL_NAME="YOUR_MODEL_NAME"
MIDSCENE_MODEL_FAMILY="YOUR_MODEL_FAMILY"
```

See the [model strategy documentation](https://midscenejs.com/model-strategy.html) for supported models and the exact variables required by your provider.

Run the cases in a visible browser:

```bash
pnpm run test:headed
```

Use `pnpm test` for headless execution.

## What the cases do

[`cases/todo.yaml`](./cases/todo.yaml) contains one Workflow Document with two cases:

1. **Seed TodoMVC with deterministic Nodes** verifies that lifecycle setup and the custom Todo Nodes work without asking AI to prepare fixture data.
2. **Manage TodoMVC with AI** asks AI to delete one Todo and complete another, validates the visible meaning with `aiAssert`, and then verifies the exact DOM state with `todo.expectState`.

The lifecycle is:

```text
Project setup: launch Chromium
  beforeAll: set the viewport
    Case 1: beforeEach -> steps -> afterEach
    Case 2: beforeEach -> steps -> afterEach
  afterAll: add a note to the Midscene report
Project teardown: destroy Agent -> close Chromium
```

`beforeEach` navigates to TodoMVC and calls `todo.seed`, so every case attempt starts with the same three items. `afterEach` calls `todo.captureState` even when a case body fails.

## Where to find the results

After a run, inspect:

- `.midscene/test-results/<run-id>/summary.json` for the Test Runner summary.
- `midscene_run/report/` for the Midscene HTML report and AI execution details.

Both locations are ignored by Git.

## Try small changes

These edits make the runner behavior easy to observe:

1. Add an item to `todo.seed.items` and update the expected state in both cases.
2. Add an unknown field under `todo.seed` to see `z.strictObject()` reject the input before Node execution.
3. Rename `todo.expectState` in the YAML to see collection fail for an unknown Node.
4. Change a Node description, run `pnpm run describe:nodes:file`, and inspect the generated diff in `midscene-nodes.md`.

## Troubleshooting

- **Model configuration error:** `describe:nodes` should still work. Check `.env` before running the AI cases.
- **Chromium executable missing:** run `pnpm run browser:install` in this directory.
- **TodoMVC navigation failure:** verify that `https://todomvc.com/examples/react/dist/` is reachable from your environment.
- **Need to watch the actions:** use `pnpm run test:headed`; `pnpm test` is headless by default.

## References

- [Test Runner overview](https://midscenejs.com/test-runner-overview.html)
- [Write and run Test Runner cases](https://midscenejs.com/use-test-runner.html)
- [Extend the Test Runner with custom Nodes](https://midscenejs.com/extend-test-runner.html)
