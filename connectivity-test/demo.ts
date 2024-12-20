import puppeteer from "puppeteer";
import os from "node:os";
import { PuppeteerAgent } from "@midscene/web/puppeteer";
import "dotenv/config";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
Promise.resolve(
  (async () => {
    const browser = await puppeteer.launch({
      headless: true, // 'true' means we can't see the browser window
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1280,
      height: 800,
      deviceScaleFactor: os.platform() === "darwin" ? 2 : 1, // this is used to avoid flashing on UI Mode when doing screenshot on Mac
    });

    await page.goto("https://www.ebay.com");
    await sleep(5000);

    // 👀 init Midscene agent
    const mid = new PuppeteerAgent(page);

    // 👀 type keywords, perform a search
    await mid.aiAction('type "Headphones" in search box, hit Enter');

    // 👀 wait for the loading
    await mid.aiWaitFor("there is at least one headphone item on page");
    // or you may use a plain sleep:
    // await sleep(5000);

    // 👀 understand the page content, find the items
    const items = await mid.aiQuery(
      "{itemTitle: string, price: Number}[], find item in list and corresponding price"
    );
    console.log("headphones in stock", items);

    // 👀 assert by AI
    await mid.aiAssert("There is a category filter on the left");

    await browser.close();
  })()
);
