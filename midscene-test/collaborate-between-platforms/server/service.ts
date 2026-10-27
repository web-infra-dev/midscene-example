import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { type IncomingMessage, createServer } from 'node:http';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

interface StoredTodo {
  id: string;
  title: string;
  completed: boolean;
}
interface Workspace {
  version: number;
  todos: StoredTodo[];
}
class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}
async function body(
  request: IncomingMessage,
): Promise<Record<string, unknown>> {
  let length = 0;
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    length += chunk.length;
    if (length > 16384)
      throw new HttpError(413, 'Request body exceeds 16 KiB.');
    chunks.push(Buffer.from(chunk));
  }
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!value || Array.isArray(value) || typeof value !== 'object')
      throw new Error();
    return value;
  } catch {
    throw new HttpError(400, 'Expected a JSON object.');
  }
}
function title(value: unknown): string {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > 300)
    throw new HttpError(400, 'Title must contain 1–300 characters.');
  return value.trim();
}

/** Minimal shared storage for the platform collaboration example. */
export async function startTodoService(
  options: { host?: string; port?: number } = {},
) {
  const workspaces = new Map<string, Workspace>();
  const require = createRequire(import.meta.url);
  const assets = new Map([
    [
      '/app.js',
      {
        type: 'text/javascript',
        path: fileURLToPath(new URL('../public/app.js', import.meta.url)),
      },
    ],
    [
      '/todomvc.css',
      { type: 'text/css', path: require.resolve('todomvc-app-css/index.css') },
    ],
  ]);
  const html = await readFile(
    new URL('../public/index.html', import.meta.url),
    'utf8',
  );
  const server = createServer(async (request, response) => {
    const reply = (status: number, data: unknown) => {
      response.writeHead(status, {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      });
      response.end(JSON.stringify(data));
    };
    try {
      const path = new URL(request.url || '/', 'http://localhost').pathname;
      const method = request.method;
      if (path === '/health' && method === 'GET')
        return reply(200, { ready: true });
      const asset = assets.get(path);
      if (asset && method === 'GET') {
        response.writeHead(200, {
          'content-type': `${asset.type}; charset=utf-8`,
          'cache-control': 'no-store',
        });
        response.end(await readFile(asset.path));
        return;
      }
      if (/^\/(todo|admin)\/[a-zA-Z0-9-]+$/.test(path) && method === 'GET') {
        response.writeHead(200, {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'no-store',
        });
        response.end(html);
        return;
      }
      if (path === '/api/workspaces' && method === 'POST') {
        if (workspaces.size >= 10000)
          throw new HttpError(503, 'Workspace limit reached.');
        const id = randomUUID();
        workspaces.set(id, { version: 0, todos: [] });
        return reply(201, { id });
      }
      const match =
        /^\/api\/workspaces\/([a-zA-Z0-9-]+)(?:\/todos(?:\/([a-zA-Z0-9-]+))?)?$/.exec(
          path,
        );
      if (!match) throw new HttpError(404, 'Route not found.');
      const [, workspaceId, todoId] = match;
      const workspace = workspaces.get(workspaceId);
      if (!workspace) throw new HttpError(404, 'Workspace not found.');
      if (path === `/api/workspaces/${workspaceId}` && method === 'DELETE') {
        workspaces.delete(workspaceId);
        return reply(200, { deleted: true });
      }
      if (!path.includes('/todos'))
        throw new HttpError(405, 'Method not allowed.');
      if (method === 'GET' && !todoId) return reply(200, workspace);
      if (method === 'POST' && !todoId) {
        const input = await body(request);
        const item = {
          id: randomUUID(),
          title: title(input.title),
          completed: false,
        };
        workspace.todos.push(item);
        workspace.version++;
        return reply(201, item);
      }
      const item = workspace.todos.find((todo) => todo.id === todoId);
      if (!item) throw new HttpError(404, 'Todo not found.');
      if (method === 'PATCH') {
        const input = await body(request);
        if (input.title === undefined && input.completed === undefined)
          throw new HttpError(400, 'Provide title or completed.');
        const nextTitle =
          input.title === undefined ? item.title : title(input.title);
        if (
          input.completed !== undefined &&
          typeof input.completed !== 'boolean'
        )
          throw new HttpError(400, 'completed must be boolean.');
        item.title = nextTitle;
        if (typeof input.completed === 'boolean')
          item.completed = input.completed;
        workspace.version++;
        return reply(200, item);
      }
      if (method === 'DELETE') {
        workspace.todos = workspace.todos.filter((todo) => todo.id !== todoId);
        workspace.version++;
        return reply(200, { deleted: true });
      }
      throw new HttpError(405, 'Method not allowed.');
    } catch (error) {
      if (error instanceof HttpError) {
        reply(error.status, { error: error.message });
        return;
      }
      console.error('Unhandled todo service error:', error);
      reply(500, { error: 'Internal server error.' });
    }
  });
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(options.port ?? 0, options.host ?? '0.0.0.0', () => {
      server.off('error', reject);
      resolve();
    });
  });
  const address = server.address();
  if (!address || typeof address === 'string')
    throw new Error('Todo server has no TCP address.');
  return {
    port: address.port,
    localUrl: `http://127.0.0.1:${address.port}`,
    async close() {
      server.closeAllConnections();
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    },
  };
}
