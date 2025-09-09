import "dotenv/config"; // read environment variables from .env file
import { midsceneAgentForSampleDevice } from "../src";

Promise.resolve(
	(async () => {
		const agent = await midsceneAgentForSampleDevice({ foo: "bar" });

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
