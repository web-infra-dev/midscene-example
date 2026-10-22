import { type AndroidAgent, agentFromAdbDevice } from '@midscene/android';
import { type IOSAgent, agentFromWebDriverAgent } from '@midscene/ios';
import { defineProjectSetup } from '@midscene/test/config';
import { PlaywrightAgent } from '@midscene/web/playwright/agent';
import { config as loadEnv } from 'dotenv';
import { type Page, chromium } from 'playwright';

loadEnv({ path: new URL('./.env', import.meta.url), quiet: true });
loadEnv({ path: new URL('../../.env', import.meta.url), quiet: true });

export interface Context {
  mobile: AndroidAgent | IOSAgent;
  web: PlaywrightAgent;
  page: Page;
  workspace?: string;
  todoId?: string;
}

// Each phone owns a separate Web admin session.
async function pairWithWeb(
  mobile: Context['mobile'],
  onTeardown: (cleanup: () => Promise<void>) => void,
): Promise<Context> {
  onTeardown(() => mobile.destroy());
  const browser = await chromium.launch({
    headless: process.env.HEADLESS !== 'false',
  });
  onTeardown(() => browser.close());
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });
  const web = new PlaywrightAgent(page, { forceChromeSelectRendering: false });
  onTeardown(() => web.destroy());
  return { mobile, web, page };
}

export const androidSetup = defineProjectSetup<Context>({
  name: 'android-and-web',
  async setup({ onTeardown }) {
    const mobile = await agentFromAdbDevice(
      process.env.ANDROID_DEVICE_ID || 'emulator-5554',
      {
        autoDismissKeyboard: false,
        screenshotShrinkFactor: 2,
      },
    );
    return pairWithWeb(mobile, onTeardown);
  },
});

export const iosSetup = defineProjectSetup<Context>({
  name: 'ios-and-web',
  async setup({ onTeardown }) {
    const mobile = await agentFromWebDriverAgent({
      wdaBaseUrl: process.env.WDA_BASE_URL || 'http://127.0.0.1:8100',
      wdaMjpegUrl: process.env.WDA_MJPEG_URL,
      autoDismissKeyboard: false,
      screenshotShrinkFactor: 2,
    });
    return pairWithWeb(mobile, onTeardown);
  },
});
