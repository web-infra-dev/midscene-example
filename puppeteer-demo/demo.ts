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

    // 👀 初始化 MidScene agent
    const mid = new PuppeteerAgent(page);

    // 👀 执行搜索
    // 注：尽管这是一个英文页面，你也可以用中文指令控制它
    await mid.aiAction('在搜索框输入 "Headphones" ，敲回车');
    await sleep(5000);

    // 👀 理解页面，提取数据
    const items = await mid.aiQuery(
      "{itemTitle: string, price: Number}[], 找到列表里的商品标题和价格"
    );
    console.log("耳机商品信息", items);

    await browser.close();
  })()
);
