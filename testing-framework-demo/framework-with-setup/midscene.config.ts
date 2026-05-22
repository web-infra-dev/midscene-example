import { PlaywrightAgent } from '@midscene/web/playwright';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';

export interface MidsceneConfig {
  testDir: string;
  include: string[];
  maxConcurrency: number;
  bail: number;
  testTimeout: number;
  output: {
    summary: string;
  };
  use: {
    baseUrl: string;
    viewport: {
      width: number;
      height: number;
    };
    headless: boolean;
  };
  setup: (context: { use: MidsceneConfig['use'] }) => Promise<SetupResult>;
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
  testDir: './e2e',
  include: ['**/*.yaml'],

  maxConcurrency: 1,
  bail: 0,
  testTimeout: 120_000,

  output: {
    summary: './midscene_run/output/summary.json',
  },

  use: {
    baseUrl: process.env.DEMO_SITE_URL ?? 'http://127.0.0.1:3000',
    viewport: { width: 1280, height: 800 },
    headless: process.env.MIDSCENE_DEMO_HEADLESS !== 'false',
  },

  async setup({ use }) {
    const browser = await chromium.launch({
      headless: use.headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const context = await browser.newContext({
      viewport: use.viewport,
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
    await page.goto(`${use.baseUrl}/catalog.html`);

    const agent = new PlaywrightAgent(page, {
      groupName: 'Framework With Setup',
      groupDescription:
        'midscene.config.ts owns case discovery, concurrency, browser session, cookies, page, and Midscene agent setup.',
      reportFileName: 'framework-with-setup',
      cache: true,
    });

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
