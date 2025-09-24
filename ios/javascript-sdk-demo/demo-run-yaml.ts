import { agentFromWebDriverAgent } from '@midscene/ios';
import "dotenv/config";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
Promise.resolve(
  (async () => {
    // 👀 init Midscene agent
    const agent = await agentFromWebDriverAgent({
      aiActionContext:
        'If any location, permission, user agreement, etc. popup, click agree. If login page pops up, close it.',
    });
    await agent.launch('https://www.ebay.com');

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
      - aiNumber: "What is the price of the first headphone?"
      - aiBoolean: "Is the price of the headphones more than 1000?"
      - aiString: "What is the name of the first headphone?"
      - aiLocate: "What is the location of the first headphone?"
`);

    console.log(result);
  })()
);
