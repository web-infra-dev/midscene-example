import { PlaywrightAgent } from '@midscene/web/playwright';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';

export interface MidsceneConfig {
  platform: 'web';
  testDir: string;
  include: string[];
  testRunner: {
    maxConcurrency: number;
    bail: number;
    testTimeout: number;
  };
  output: {
    summary: string;
  };
  runtimeOptions: {
    baseUrl: string;
    viewport: {
      width: number;
      height: number;
    };
    headless: boolean;
  };
  agentOptions: {
    groupName: string;
    groupDescription: string;
    reportFileName: string;
    cache: boolean;
  };
  setup: (context: {
    agentOptions: MidsceneConfig['agentOptions'];
    runtimeOptions: MidsceneConfig['runtimeOptions'];
  }) => Promise<SetupResult>;
}

export interface SetupResult {
  agent: PlaywrightAgent;
  browser: Browser;
  context: BrowserContext;
  page: Page;
  teardown: () => Promise<void>;
}

function defineMidsceneConfig(config: MidsceneConfig): MidsceneConfig {
  return config;
}

export default defineMidsceneConfig({
  platform: 'web',
  testDir: './e2e',
  include: ['**/*.yaml'],

  testRunner: {
    maxConcurrency: 1,
    bail: 0,
    testTimeout: 120_000,
  },

  output: {
    summary: './midscene_run/output/summary.json',
  },

  runtimeOptions: {
    baseUrl: process.env.DEMO_SITE_URL ?? 'http://127.0.0.1:3000',
    viewport: { width: 1280, height: 800 },
    headless: process.env.MIDSCENE_DEMO_HEADLESS !== 'false',
  },

  agentOptions: {
    groupName: 'Framework With Config',
    groupDescription:
      'midscene.config.ts owns case discovery, execution policy, browser session setup, and shared Midscene agent options.',
    reportFileName: 'framework-with-setup',
    cache: true,
  },

  async setup({ agentOptions, runtimeOptions }) {
    const browser = await chromium.launch({
      headless: runtimeOptions.headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const context = await browser.newContext({
      viewport: runtimeOptions.viewport,
    });

    await context.addCookies([
      {
        name: 'demo_user',
        value: 'returning-buyer',
        domain: '127.0.0.1',
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'Lax',
      },
      {
        name: 'demo_segment',
        value: 'qa-smoke',
        domain: '127.0.0.1',
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'Lax',
      },
    ]);

    const page = await context.newPage();
    await page.goto(`${runtimeOptions.baseUrl}/catalog.html`);

    const agent = new PlaywrightAgent(page, agentOptions);

    return {
      agent,
      browser,
      context,
      page,
      async teardown() {
        await context.close();
        await browser.close();
      },
    };
  },
});
