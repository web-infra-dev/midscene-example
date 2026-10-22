import { startTodoService } from './service';

const port = Number(process.env.SHOWCASE_PORT || 4173);
const server = await startTodoService({ port });
const workspace = (await fetch(`${server.localUrl}/api/workspaces`, {
  method: 'POST',
}).then((response) => response.json())) as { id: string };
console.log(`Todo: ${server.localUrl}/todo/${workspace.id}`);
console.log(`Admin: ${server.localUrl}/admin/${workspace.id}`);
console.log(
  `Phones: replace 127.0.0.1 with this computer's LAN IP (port ${server.port}).`,
);
let closing = false;
for (const signal of ['SIGINT', 'SIGTERM'] as const)
  process.on(signal, async () => {
    if (closing) return;
    closing = true;
    await server.close();
  });
