import "dotenv/config"; // read environment variables from .env file
import { AgentOverChromeBridge } from "@midscene/web/bridge-mode";

Promise.resolve(
  (async () => {
    const agent = new AgentOverChromeBridge();

    // This will connect to **the current active tab** on your desktop Chrome
    // remember to start your chrome extension, click 'allow connection' button.
    await agent.connectCurrentTab();
    // After connected, you can see this log. Otherwise you will get an timeout error.
    console.log("connected to the active tab !");

    await agent.aiAction('点击 type 下拉框，点击 type 下拉框下面的输入框，点击 Individual');

    // const content = await agent.aiQuery(
    //   "what is the title of the page? answer in {title: string}"
    // );
    // console.log(content);
    await agent.destroy();
  })()
);
