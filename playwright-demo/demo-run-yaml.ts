import { chromium } from "playwright";
import { PlaywrightAgent } from "@midscene/web/playwright";
import "dotenv/config";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
Promise.resolve(
  (async () => {
    const browser = await chromium.launch({
      headless: true, // 'true' means we can't see the browser window
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewportSize({
      width: 1280,
      height: 800,
    });

    await page.goto("https://www.ebay.com");
    await sleep(5000);

    const agent = new PlaywrightAgent(page);

    // 👀 run YAML with agent
    const { result } = await agent.runYaml(`
tasks:
  - name: search
    flow:
      - ai: input 'Headphones' in search box, click search button
      - sleep: 3000

  - name: query
    flow:
      - aiQuery: "{itemTitle: string, price: Number}[], find item in list and corresponding price"
        name: headphones
      - aiNumber: "What is the price of the first headphone?"
      - aiBoolean: "Is the price of the headphones more than 1000?"
      - aiString: "What is the name of the first headphone?"
      - aiLocate: "What is the location of the first headphone?"
`);

    console.log(result);

    await browser.close();
  })()
);
