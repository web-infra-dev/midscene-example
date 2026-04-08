import {
  AndroidAgent,
  AndroidDevice,
  getConnectedDevices,
} from '@midscene/android';
import 'dotenv/config'; // read environment variables from .env file

const sleep = (ms: number | undefined) => new Promise((r) => setTimeout(r, ms));
Promise.resolve(
  (async () => {
    const devices = await getConnectedDevices();
    const page = new AndroidDevice(devices[0].udid, {
      // 👀 Disable auto keyboard dismiss to avoid ESCAPE/BACK key side-effects in WebView / Mobile web pages
      // Some input fields listen for ESCAPE or BACK key events and may clear the input
      // See: https://midscenejs.com/android-getting-started.html#text-input-is-cleared-or-lost-after-typing
      autoDismissKeyboard: false,
    });

    // 👀 init Midscene agent
    const agent = new AndroidAgent(page, {
      aiActContext:
        'If any location, permission, user agreement, etc. popup, click agree. If login page pops up, close it.',
    });
    await page.connect();
    await page.launch('https://www.ebay.com');

    await sleep(5000);

    // 👀 type keywords, perform a search
    await agent.aiAct('type "Headphones" in search box, click search button');

    // 👀 wait for the loading
    await agent.aiWaitFor('there is at least one headphone item on page');
    // or you may use a plain sleep:
    // await sleep(5000);

    // 👀 understand the page content, find the items
    const items = await agent.aiQuery(
      '{itemTitle: string, price: Number}[], find item in list and corresponding price'
    );
    console.log('headphones in stock', items);

    const isMoreThan1000 = await agent.aiBoolean(
      'Is the price of the headphones more than 1000?'
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

    const location = await agent.aiLocate(
      'What is the location of the first headphone?'
    );
    console.log('location', location);

    // 👀 assert by AI
    await agent.aiAssert('There is a category filter on the left');
  })()
);
