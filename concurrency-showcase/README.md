# Concurrency Showcases

Three independent examples. Start with readable YAML, then the short platform/concurrency configuration.

| Example | Read the cases | Run inside its directory |
| --- | --- | --- |
| [Cross-platform](./cross-platform/) | [cases/todo.yaml](./cross-platform/cases/todo.yaml): six flows across Web, Android and iOS | `pnpm start` |
| [Device sharding](./device-sharding/) | [cases/todo.yaml](./device-sharding/cases/todo.yaml): six flows parameterized and partitioned | `CASE_COUNT=300 pnpm start` |
| [Mixed-platform](./mixed-platform/) | [cases/handoff.yaml](./mixed-platform/cases/handoff.yaml): phone creates → Web completes → phone verifies | `pnpm start` |

The first two use public TodoMVC; only the third starts a shared local service. Each `midscene.config.ts` directly lists Projects, YAML paths and concurrency limits. Results use native Midscene reports. Each example installs/runs independently, with no project `.test.ts` files.

Official docs: [Concurrency limits](https://midscenejs.com/midscene-test/configuration#concurrency-and-isolation), [Multiple Projects](https://midscenejs.com/midscene-test/configuration#configure-multiple-execution-projects), [File isolation](https://midscenejs.com/midscene-test/configuration#isolate-resources-with-filesetup), and [Execution order](https://midscenejs.com/midscene-test/use#execution-order-and-retries).
