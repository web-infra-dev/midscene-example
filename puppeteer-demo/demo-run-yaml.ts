import puppeteer from 'puppeteer';
import os from 'node:os';
import { PuppeteerAgent } from '@midscene/web/puppeteer';
import 'dotenv/config';

const sleep = (ms: number | undefined) => new Promise((r) => setTimeout(r, ms));
Promise.resolve(
  (async () => {
    const browser = await puppeteer.launch({
      headless: true, // 'true' means we can't see the browser window
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1280,
      height: 800,
      deviceScaleFactor: 0
    });

    await page.goto('https://www.bing.com/');
    await sleep(5000);

    const agent = new PuppeteerAgent(page);

    // 👀 run YAML with agent
    const { result } = await agent.runYaml(`
tasks:
  - name: search
    flow:
      - ai: input 'Headphones Price' in search box, click search button
      - sleep: 3000

  - name: query
    flow:
      - aiQuery: "{itemTitle: string, price: Number}[], find item in list and corresponding price"
        name: headphones
      - aiNumber: "What is the price of the first headphone?"
      - aiBoolean: "Is the price of the first headphone more than 1000?"
      - aiString: "What is the name of the first headphone?"
`);

    console.log(result);

    await browser.close();
  })()
);
