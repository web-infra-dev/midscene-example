import { AndroidAgent } from '@midscene/android';
import { Agent } from '@midscene/core/agent';
import { defineNode, z } from '@midscene/test';
import { createMidsceneNodes } from '@midscene/test/midscene';
import type { Context } from './setup';

const mobileNodes = createMidsceneNodes<Context>({
  namespace: 'mobile',
  agentClass: Agent,
  getAgent: ({ context }) => context.mobile,
});
const webNodes = createMidsceneNodes<Context>({
  namespace: 'web',
  agentClass: Agent,
  getAgent: ({ context }) => context.web,
});

async function api(path: string, method = 'GET', signal?: AbortSignal) {
  if (!process.env.TODO_LOCAL_URL)
    throw new Error('Use pnpm start to launch the shared Todo service.');
  const response = await fetch(
    `${process.env.TODO_LOCAL_URL}/api/workspaces${path}`,
    { method, signal },
  );
  if (!response.ok) throw new Error(`Todo service: ${response.status}`);
  return response.json();
}

const empty = z.strictObject({});
export const nodes = [
  ...mobileNodes,
  ...webNodes,
  defineNode<typeof empty, unknown, Context>({
    name: 'todo.open',
    inputSchema: empty,
    async execute({ context, signal, onTeardown }) {
      const { id } = await api('', 'POST', signal);
      context.workspace = id;
      context.todoId = undefined;
      onTeardown(async () => {
        await api(`/${id}`, 'DELETE', AbortSignal.timeout(10_000));
      });
      const emulator =
        context.mobile instanceof AndroidAgent &&
        (process.env.ANDROID_DEVICE_ID || 'emulator-5554').startsWith(
          'emulator-',
        );
      const phoneBase = emulator
        ? `http://10.0.2.2:${new URL(process.env.TODO_LOCAL_URL!).port}`
        : process.env.TODO_PUBLIC_URL;
      await context.page.goto(`${process.env.TODO_LOCAL_URL}/admin/${id}`);
      await context.page.locator('.new-todo').waitFor({ state: 'visible' });
      await context.mobile.launch(`${phoneBase}/todo/${id}`);
      return { data: { workspace: id } };
    },
  }),
  defineNode({
    name: 'todo.captureId',
    stringInputKey: 'title',
    inputSchema: z.strictObject({ title: z.string() }),
    async execute({
      context,
      input,
      signal,
    }: { context: Context; input: { title: string }; signal: AbortSignal }) {
      const { todos } = await api(`/${context.workspace}/todos`, 'GET', signal);
      if (
        todos.length !== 1 ||
        todos[0].title !== input.title ||
        todos[0].completed
      )
        throw new Error(
          'The phone must create exactly one unchecked Todo with the specified title.',
        );
      context.todoId = todos[0].id;
      return { data: { todoId: context.todoId } };
    },
  }),
  defineNode<typeof empty, unknown, Context>({
    name: 'todo.verifyId',
    inputSchema: empty,
    async execute({ context, signal }) {
      const { todos } = await api(`/${context.workspace}/todos`, 'GET', signal);
      if (
        !context.todoId ||
        todos.length !== 1 ||
        todos[0].id !== context.todoId ||
        todos[0].completed !== true
      )
        throw new Error('The original phone-created Todo was not completed.');
      return { data: { todoId: context.todoId, completed: true } };
    },
  }),
];
