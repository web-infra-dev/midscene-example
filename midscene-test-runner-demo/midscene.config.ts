import "dotenv/config";

import { defineProjectSetup, defineTestProject } from "@midscene/test/config";
import { createMidsceneNodes } from "@midscene/test/midscene";
import { createPlaywrightNodes } from "@midscene/test/playwright";
import { PlaywrightAgent } from "@midscene/web/playwright";
import { type Browser, type Page, chromium } from "playwright";
import { createTodoNodes } from "./nodes/todo";

const TODO_MVC_URL = "https://todomvc.com/examples/react/dist/";

interface ProjectContext {
  browser: Browser;
  page: Page;
  baseUrl: string;
  agent?: PlaywrightAgent;
}

const playwrightSetup = defineProjectSetup<ProjectContext>({
  name: "playwright",
  platform: "web",
  async setup({ onTeardown }) {
    const browser = await chromium.launch({
      headless: process.env.HEADLESS !== "false",
    });
    onTeardown(() => browser.close());

    const page = await browser.newPage();
    const context: ProjectContext = {
      browser,
      page,
      baseUrl: TODO_MVC_URL,
    };

    // Project teardown runs in LIFO order, so the Agent is destroyed before
    // Playwright closes the browser registered above.
    onTeardown(async () => context.agent?.destroy());
    return context;
  },
});

const playwrightNodes = createPlaywrightNodes<ProjectContext>({
  getPage: ({ context }) => context.page,
  getBaseUrl: ({ context }) => context.baseUrl,
});

const midsceneNodes = createMidsceneNodes<ProjectContext>({
  getAgent: ({ context }) => {
    context.agent ??= new PlaywrightAgent(context.page);
    return context.agent;
  },
  includeLaunch: false,
});

const todoNodes = createTodoNodes<ProjectContext>({
  getPage: (context) => context.page,
});

export default defineTestProject<ProjectContext>({
  projects: [
    {
      name: "chromium",
      platform: "web",
      setup: playwrightSetup,
      files: { include: ["cases/**/*.{yaml,yml}"] },
    },
  ],
  nodes: [...todoNodes, ...playwrightNodes, ...midsceneNodes],
  test: {
    testTimeout: 120_000,
  },
  output: {
    reportDir: "./midscene_run/report",
  },
});
