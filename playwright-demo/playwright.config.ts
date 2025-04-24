import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  timeout: 10 * 60 * 1000,
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: Boolean(process.env.CI),
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["line"], ["@midscene/web/playwright-report"]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    
    // add chinese support
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
    
    // 设置默认字符编码
    launchOptions: {
      args: [
        '--lang=zh-CN',
        '--disable-gpu',
        '--font-render-hinting=medium'
      ]
    }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { 
        ...devices["Desktop Chrome"],
        // ensure browser use appropriate language settings
        contextOptions: {
          locale: 'zh-CN',
          geolocation: { longitude: 116.3883, latitude: 39.9289 }, // 北京
          permissions: ['geolocation'],
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          deviceScaleFactor: 1,
          isMobile: false,
          hasTouch: false,
        },
      },
    },
  ],
});
