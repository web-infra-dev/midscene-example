import puppeteer from "puppeteer";
import { PuppeteerAgent } from "@midscene/web";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
Promise.resolve(
  (async () => {
    const browser = await puppeteer.launch({
      headless: false, // here we use headed mode to help debug
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
    });

    await page.goto("https://www.ebay.com");
    await sleep(5000);

    // 👀 init Midscene agent
    const mid = new PuppeteerAgent(page);

    // 👀 type keywords, perform a search
    await mid.aiAction('type "Headphones" in search box, hit Enter');
    await sleep(5000);

    // 👀 understand the page content, find the items
    const items = await mid.aiQuery(
      "{itemTitle: string, price: Number}[], find item in list and corresponding price"
    );
    console.log("headphones in stock", items);

    await mid.aiAssert("There is a category filter on the left");

    await browser.close();
  })()
);
