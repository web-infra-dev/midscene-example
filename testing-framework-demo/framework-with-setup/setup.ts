import { PlaywrightAgent } from '@midscene/web/playwright';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';

export interface SetupResult {
  agent: PlaywrightAgent;
  browser: Browser;
  context: BrowserContext;
  page: Page;
  freeFn: Array<() => Promise<void>>;
}

export default async function setup(): Promise<SetupResult> {
  const baseUrl = process.env.DEMO_SITE_URL ?? 'http://127.0.0.1:3000';
  const browser = await chromium.launch({
    headless: process.env.MIDSCENE_DEMO_HEADLESS !== 'false',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
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
  await page.goto(`${baseUrl}/catalog.html`);

  const agent = new PlaywrightAgent(page, {
    groupName: 'Framework With Setup',
    groupDescription: 'Playwright browser, cookies, page, and Midscene agent are created in setup.ts.',
    reportFileName: 'framework-with-setup',
    cache: true,
  });

  return {
    agent,
    browser,
    context,
    page,
    freeFn: [
      async () => {
        await context.close();
      },
      async () => {
        await browser.close();
      },
    ],
  };
}
