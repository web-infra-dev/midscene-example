import { basename } from 'node:path';
import { AndroidAgent, agentFromAdbDevice } from '@midscene/android';
import { Agent } from '@midscene/core/agent';
import { IOSAgent, agentFromWebDriverAgent } from '@midscene/ios';
import { defineNode, z } from '@midscene/test';
import { defineFileSetup, defineProjectSetup } from '@midscene/test/config';
import { createMidsceneNodes } from '@midscene/test/midscene';
import { PlaywrightAgent } from '@midscene/web/playwright/agent';
import { config as loadEnv } from 'dotenv';
import { type Browser, type Page, chromium } from 'playwright';
import {
  type DevicePool,
  createDevicePool,
  readDeviceList,
  readEndpointList,
} from './devices';

loadEnv({ path: new URL('./.env', import.meta.url), quiet: true });
loadEnv({ path: new URL('../../.env', import.meta.url), quiet: true });

export interface Context {
  agent: PlaywrightAgent | AndroidAgent | IOSAgent;
  page?: Page;
  resource: string;
}

interface IOSDevice {
  wdaBaseUrl: string;
  wdaMjpegUrl: string;
}

export type SharedContext =
  | { platform: 'web'; browser: Browser }
  | { platform: 'android'; devices: DevicePool<string> }
  | { platform: 'ios'; devices: DevicePool<IOSDevice> };

function logResource(
  event: 'acquired' | 'released',
  project: string,
  file: string,
  resource: string,
) {
  console.log(
    `[resource] ${event} project=${project} file=${basename(file)} resource=${resource}`,
  );
}

export const webSetup = defineProjectSetup<SharedContext>({
  name: 'web',
  async setup({ signal, onTeardown }) {
    const browser = await chromium.launch({
      headless: process.env.HEADLESS !== 'false',
    });
    onTeardown(() => browser.close());
    signal.throwIfAborted();
    return { platform: 'web', browser };
  },
});

export const webFileSetup = defineFileSetup<Context, SharedContext>({
  name: 'web-session',
  async setup({ projectContext, project, file, signal, onTeardown }) {
    if (projectContext?.platform !== 'web')
      throw new Error('Web Browser setup did not complete.');
    const session = await projectContext.browser.newContext({
      viewport: { width: 1280, height: 800 },
    });
    const resource = `browser-context:${file.documentRunId}`;
    onTeardown(async () => {
      await session.close();
      logResource('released', project.name, file.sourcePath, resource);
    });
    signal.throwIfAborted();
    const page = await session.newPage();
    const agent = new PlaywrightAgent(page, {
      forceChromeSelectRendering: false,
    });
    onTeardown(() => agent.destroy());
    signal.throwIfAborted();
    logResource('acquired', project.name, file.sourcePath, resource);
    return { agent, page, resource };
  },
});

export const androidSetup = defineProjectSetup<SharedContext>({
  name: 'android',
  setup({ project }) {
    return {
      platform: 'android',
      devices: createDevicePool(
        readDeviceList('ANDROID_DEVICE_IDS'),
        project.maxConcurrentFiles!,
        'Android',
      ),
    };
  },
});

export const androidFileSetup = defineFileSetup<Context, SharedContext>({
  name: 'android-device',
  async setup({ projectContext, project, file, signal, onTeardown }) {
    if (projectContext?.platform !== 'android')
      throw new Error('Android device pool setup did not complete.');
    const pool = projectContext.devices;
    const deviceId = pool.acquire();
    let agent: AndroidAgent | undefined = undefined;
    onTeardown(async () => {
      // Do not return the allocation until the Agent has released its Device.
      if (agent) await agent.destroy();
      pool.release(deviceId);
      logResource('released', project.name, file.sourcePath, deviceId);
    });
    signal.throwIfAborted();
    agent = await agentFromAdbDevice(deviceId, {
      autoDismissKeyboard: false,
      screenshotShrinkFactor: 2,
    });
    signal.throwIfAborted();
    logResource('acquired', project.name, file.sourcePath, deviceId);
    return { agent, resource: deviceId };
  },
});

export const iosSetup = defineProjectSetup<SharedContext>({
  name: 'ios',
  setup({ project }) {
    const urls = readEndpointList('WDA_BASE_URLS');
    const streams = readEndpointList('WDA_MJPEG_URLS');
    if (urls.length !== streams.length)
      throw new Error(
        'WDA_BASE_URLS and WDA_MJPEG_URLS must have matching lengths.',
      );
    return {
      platform: 'ios',
      devices: createDevicePool(
        urls.map((wdaBaseUrl, index) => ({
          wdaBaseUrl,
          wdaMjpegUrl: streams[index],
        })),
        project.maxConcurrentFiles!,
        'iOS',
      ),
    };
  },
});

export const iosFileSetup = defineFileSetup<Context, SharedContext>({
  name: 'ios-device',
  async setup({ projectContext, project, file, signal, onTeardown }) {
    if (projectContext?.platform !== 'ios')
      throw new Error('iOS device pool setup did not complete.');
    const pool = projectContext.devices;
    const device = pool.acquire();
    let agent: IOSAgent | undefined = undefined;
    onTeardown(async () => {
      if (agent) await agent.destroy();
      pool.release(device);
      logResource('released', project.name, file.sourcePath, device.wdaBaseUrl);
    });
    signal.throwIfAborted();
    agent = await agentFromWebDriverAgent({
      ...device,
      autoDismissKeyboard: false,
      screenshotShrinkFactor: 2,
    });
    signal.throwIfAborted();
    logResource('acquired', project.name, file.sourcePath, device.wdaBaseUrl);
    return { agent, resource: device.wdaBaseUrl };
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
    return { data: { resource: context.resource } };
  },
});

export const nodes = [
  ...createMidsceneNodes<Context>({
    agentClass: Agent,
    getAgent: ({ context }) => context.agent,
  }),
  open,
];
