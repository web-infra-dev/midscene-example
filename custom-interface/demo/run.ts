import 'dotenv/config'; // read environment variables from .env file
import { midsceneAgentForSampleDevice } from '../src';
import { playgroundForAgent } from '@midscene/playground';

// run a sample script to interact with the custom interface
Promise.resolve(
  (async () => {
    const agent = await midsceneAgentForSampleDevice({ foo: 'bar' });

    // 👀 assert by AI
    await agent.aiAssert('This is an app panel');

    // 👀 query data
    await agent.aiQuery('the name of the apps on the first row, string[]');

    // 👀 perform action based on the action space
    await agent.aiAction('launch the "1 password" app');
  })()
);

// launch playground to interact with the agent
Promise.resolve(
  (async () => {
    const anotherAgent = await midsceneAgentForSampleDevice({ foo: 'bar' });
    // // 👀 launch playground for the agent
    const server = await playgroundForAgent(anotherAgent).launch();
    setTimeout(() => {
      console.log('closing playground');
      server.close();
    }, 10 * 60 * 1000);
  })()
);
