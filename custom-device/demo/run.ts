import "dotenv/config"; // read environment variables from .env file
import { Agent } from "@midscene/core";
import SampleDevice from "../src/device/sample-device";

Promise.resolve(
	(async () => {
		const device = new SampleDevice();
		const agent = new Agent(device);

		// 👀 assert by AI
		await agent.aiAssert("This is an app panel");

		// 👀 query data
		await agent.aiQuery("the name of the apps on the first row, string[]");

		// 👀 perform action based on the action space
		await agent.aiAction('click the "1 password", and close the app panel');

		// 👀 launch playground for the agent
		// const server = await playgroundForAgent(agent).launch();

		setTimeout(() => {
			console.log("closing playground");
			// server.close();
		}, 10 * 1000);
	})(),
);
