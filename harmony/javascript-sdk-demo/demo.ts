import {
  HarmonyAgent,
  HarmonyDevice,
  getConnectedDevices,
} from '@midscene/harmony';
import 'dotenv/config';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

Promise.resolve(
  (async () => {
    const devices = await getConnectedDevices();
    const device = new HarmonyDevice(devices[0].deviceId);

    // 👀 init Midscene agent
    const agent = new HarmonyAgent(device);
    await device.connect();
    await agent.aiAct('open Browser and go to https://www.ebay.com');

    await sleep(5000);

    // 👀 type keywords, perform a search
    await agent.aiAct('type "Headphones" in search box, click search button');

    // 👀 wait for the loading
    await agent.aiWaitFor('there is at least one headphone item on page');

    // 👀 understand the page content, find the items
    const items = await agent.aiQuery(
      '{itemTitle: string, price: Number}[], find item in list and corresponding price',
    );
    console.log('headphones in stock', items);

    const isMoreThan1000 = await agent.aiBoolean(
      'Is the price of the headphones more than 1000?',
    );
    console.log('isMoreThan1000', isMoreThan1000);

    const price = await agent.aiNumber(
      'What is the price of the first headphone?',
    );
    console.log('price', price);

    const name = await agent.aiString(
      'What is the name of the first headphone?',
    );
    console.log('name', name);

    const location = await agent.aiLocate(
      'What is the location of the first headphone?',
    );
    console.log('location', location);

    // 👀 assert by AI
    await agent.aiAssert('There is a category filter on the left');
  })(),
);
