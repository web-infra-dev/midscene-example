import puppeteer from 'puppeteer';
import { PuppeteerAgent } from '@midscene/web/puppeteer';
import 'dotenv/config'; // read environment variables from .env file

const sleep = (ms: number | undefined) => new Promise((r) => setTimeout(r, ms));
Promise.resolve(
  (async () => {
    const browser = await puppeteer.launch({
      headless: false, // 'false' means we can see the browser window
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1280,
      height: 768,
      deviceScaleFactor: 0
    });

    await page.goto('https://www.bing.com');
    await sleep(5000);

    // 👀 init Midscene agent
    const agent = new PuppeteerAgent(page);

    // 👀 type keywords, perform a search
    await agent.aiAct('type "Headphones Price" in search box, hit Enter');

    // 👀 wait for the loading
    await agent.aiWaitFor('there is at least one headphone item on page');
    // or you may use a plain sleep:
    // await sleep(5000);

    // 👀 understand the page content, find the items
    const items = await agent.aiQuery<
      Array<{ itemTitle: string; price: number }>
    >(
      '{itemTitle: string, price: Number}[], find item in list and corresponding price'
    );
    console.log('headphones in stock', items);

    const isMoreThan1000 = await agent.aiBoolean(
      'Is the price of the first headphones more than 1000?'
    );
    console.log('isMoreThan1000', isMoreThan1000);

    const price = await agent.aiNumber(
      'What is the price of the first headphone?'
    );
    console.log('price', price);

    const name = await agent.aiString(
      'What is the name of the first headphone?'
    );
    console.log('name', name);

    // 👀 click on the first item
    await agent.aiTap('the first item in the list');

    await browser.close();
  })()
);
