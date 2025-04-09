import { AndroidAgent, AndroidDevice, getConnectedDevices } from '@midscene/android';
import "dotenv/config"; // read environment variables from .env file

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
Promise.resolve(
  (async () => {
    const devices = await getConnectedDevices();
    const page = new AndroidDevice(devices[0].udid);

    // 👀 init Midscene agent
    const agent = new AndroidAgent(page,{
      aiActionContext:
        'If any location, permission, user agreement, etc. popup, click agree. If login page pops up, close it.',
    });
    await page.connect();
    await page.launch('https://www.ebay.com');

    await sleep(5000);

    // 👀 type keywords, perform a search
    await agent.aiAction('type "Headphones" in search box, hit Enter');

    // 👀 wait for the loading
    await agent.aiWaitFor("there is at least one headphone item on page");
    // or you may use a plain sleep:
    // await sleep(5000);

    // 👀 understand the page content, find the items
    const items = await agent.aiQuery(
      "{itemTitle: string, price: Number}[], find item in list and corresponding price"
    );
    console.log("headphones in stock", items);

    // 👀 assert by AI
    await agent.aiAssert("There is a category filter on the left");
  })()
);
