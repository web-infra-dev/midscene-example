import { AndroidAgent, AndroidDevice, getConnectedDevices } from '@midscene/android';
import "dotenv/config";

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
`);

    console.log(result);
  })()
);
