import "dotenv/config"; // read environment variables from .env file
import { AgentOverChromeBridge } from "@midscene/web/bridge-mode";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
Promise.resolve(
  (async () => {
    const agent = new AgentOverChromeBridge({
      // uncomment this to close the new tab when destroying the agent
      // closeNewTabsAfterDisconnect: true,
    });

    // This will connect to a new tab on your desktop Chrome
    // remember to start your chrome extension, click 'allow connection' button.
    await agent.connectNewTabWithUrl("https://www.bing.com");
    // After connected, you can see this log. Otherwise you will get an timeout error.
    console.log("connected to a new tab !");

    // these are the same as normal Midscene agent
    await agent.aiAction('type "AI 101" and hit Enter');
    await sleep(3000);

    await agent.aiAssert("there are some search results");
    await agent.destroy();
  })()
);
