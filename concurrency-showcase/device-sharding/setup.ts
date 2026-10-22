import { AndroidAgent, agentFromAdbDevice } from '@midscene/android';
import { Agent } from '@midscene/core/agent';
import { IOSAgent, agentFromWebDriverAgent } from '@midscene/ios';
import { defineNode, z } from '@midscene/test';
import { defineProjectSetup } from '@midscene/test/config';
import { createMidsceneNodes } from '@midscene/test/midscene';
import { PlaywrightAgent } from '@midscene/web/playwright/agent';
import { config as loadEnv } from 'dotenv';
import { type Page, chromium } from 'playwright';

loadEnv({ path: new URL('./.env', import.meta.url), quiet: true });
loadEnv({ path: new URL('../../.env', import.meta.url), quiet: true });

interface Context {
  agent: PlaywrightAgent | AndroidAgent | IOSAgent;
  page?: Page;
}

export const webSetup = defineProjectSetup<Context>({
  name: 'web',
  async setup({ onTeardown }) {
    const browser = await chromium.launch({
      headless: process.env.HEADLESS !== 'false',
    });
    onTeardown(() => browser.close());
    const page = await browser.newPage({
      viewport: { width: 1280, height: 800 },
    });
    const agent = new PlaywrightAgent(page, {
      forceChromeSelectRendering: false,
    });
    onTeardown(() => agent.destroy());
    return { agent, page };
  },
});

export const androidSetup = defineProjectSetup<Context>({
  name: 'android',
  async setup({ onTeardown }) {
    const agent = await agentFromAdbDevice(
      process.env.ANDROID_DEVICE_ID || 'emulator-5554',
      {
        autoDismissKeyboard: false,
        screenshotShrinkFactor: 2,
      },
    );
    onTeardown(() => agent.destroy());
    return { agent };
  },
});

export const iosSetup = defineProjectSetup<Context>({
  name: 'ios',
  async setup({ onTeardown }) {
    const agent = await agentFromWebDriverAgent({
      wdaBaseUrl: process.env.WDA_BASE_URL || 'http://127.0.0.1:8100',
      wdaMjpegUrl: process.env.WDA_MJPEG_URL,
      autoDismissKeyboard: false,
      screenshotShrinkFactor: 2,
    });
    onTeardown(() => agent.destroy());
    return { agent };
  },
});

// Only platform navigation is adapted here. All business steps live in YAML.
const open = defineNode({
  name: 'todo.open',
  stringInputKey: 'url',
  inputSchema: z.strictObject({ url: z.string().url() }),
  async execute({
    context,
    input,
  }: { context: Context; input: { url: string } }) {
    if (context.page) {
      await context.page.goto(input.url, { waitUntil: 'domcontentloaded' });
      await context.page.locator('.new-todo').waitFor({ state: 'visible' });
    } else if (
      context.agent instanceof AndroidAgent ||
      context.agent instanceof IOSAgent
    ) {
      await context.agent.launch(input.url);
    }
  },
});

export const nodes = [
  ...createMidsceneNodes<Context>({
    agentClass: Agent,
    getAgent: ({ context }) => context.agent,
  }),
  open,
];
