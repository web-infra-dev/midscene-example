import 'dotenv/config'; // read environment variables from .env file
import { AgentOverChromeBridge } from '@midscene/web/bridge-mode';

Promise.resolve(
  (async () => {
    const agent = new AgentOverChromeBridge();

    // This will connect to **the current active tab** on your desktop Chrome
    // remember to start your chrome extension, click 'allow connection' button.
    await agent.connectCurrentTab();
    // After connected, you can see this log. Otherwise you will get an timeout error.
    console.log('connected to the active tab !');

    const content = await agent.aiQuery<(string)>(
      "what is the title of the page? answer in {title: string}"
    );
    console.log(content);
    await agent.destroy();
  })()
);
