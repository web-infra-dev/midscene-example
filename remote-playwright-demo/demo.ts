import { chromium } from "playwright";
import { PlaywrightAgent } from "@midscene/web/playwright";
import "dotenv/config"; // read environment variables from .env file

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

Promise.resolve(
  (async () => {
    // Get CDP WebSocket URL from environment variable
    const cdpWsUrl = process.env.CDP_WS_URL;

    if (!cdpWsUrl) {
      console.error('❌ CDP_WS_URL environment variable is not set');
      console.log('Please set CDP_WS_URL in your .env file or environment variables');
      console.log('Example: CDP_WS_URL=ws://your-remote-browser.com/devtools/browser/your-session-id');
      process.exit(1);
    }

    console.log('🔌 Connecting to remote browser via CDP...');
    console.log('CDP WebSocket URL:', cdpWsUrl);

    // Connect to remote browser via CDP
    const browser = await chromium.connectOverCDP(cdpWsUrl);
    console.log('✅ Connected to remote browser');

    // Get context and page
    const context = browser.contexts()[0];
    const page = context.pages()[0] || await context.newPage();

    // Set viewport size
    await page.setViewportSize({
      width: 1280,
      height: 768,
    });

    console.log('🌐 Navigating to eBay...');
    await page.goto("https://www.ebay.com");
    await sleep(5000);

    // 👀 init Midscene agent
    const agent = new PlaywrightAgent(page);
    console.log('🤖 Midscene agent initialized');

    // 👀 type keywords, perform a search
    console.log('🔍 Searching for Headphones...');
    await agent.aiAction('type "Headphones" in search box, hit Enter');

    // 👀 wait for the loading
    await agent.aiWaitFor("there is at least one headphone item on page");
    console.log('✅ Search results loaded');

    // 👀 understand the page content, find the items
    const items = await agent.aiQuery<Array<{ itemTitle: string; price: number }>>(
      "{itemTitle: string, price: Number}[], find item in list and corresponding price"
    );
    console.log("📦 Headphones in stock:", items);

    const isMoreThan1000 = await agent.aiBoolean("Is the price of the first headphones more than 1000?");
    console.log("💰 Price > $1000?", isMoreThan1000);

    const price = await agent.aiNumber("What is the price of the first headphone?");
    console.log("💲 First item price:", price);

    const name = await agent.aiString("What is the name of the first headphone?");
    console.log("🎧 First item name:", name);

    // 👀 assert by AI
    await agent.aiAssert("There is a category filter on the left");
    console.log("✅ Category filter assertion passed");

    // 👀 click on the first item
    await agent.aiTap("the first item in the list");
    console.log("👆 Clicked on first item");

    // Cleanup
    await agent.destroy();
    await browser.close();
    console.log('✅ Demo completed successfully');
  })()
);
