import 'dotenv/config'; // read environment variables from .env file
import { midsceneAgentForSampleDevice } from '../src';
import { playgroundForAgent } from '@midscene/playground';

// Demo 1: interact with the custom interface via agent APIs
async function runAgentDemo() {
  const agent = await midsceneAgentForSampleDevice({ foo: 'bar' });

  // 👀 assert by AI
  await agent.aiAssert('This is an app panel');

  // 👀 query data
  await agent.aiQuery<Array<string>>(
    'the name of the apps on the first row, string[]'
  );

  // 👀 perform action based on the action space
  await agent.aiAction('launch the "1 password" app');
}

// Demo 2: launch playground to interact with the agent
async function runPlaygroundDemo() {
  const agent = await midsceneAgentForSampleDevice({ foo: 'bar' });
  // 👀 launch playground for the agent
  const server = await playgroundForAgent(agent).launch();
  console.log('playground launched, hit ctrl+c to interrupt');

  // close playground after 1 minutes
  // setTimeout(async () => {
  //   console.log('closing playground');
  //   await server.close();
  // }, 60 * 1000);
}

// Execute both demos
(async () => {
  console.log('running agent demo');
  await runAgentDemo();

  console.log('running playground demo');
  await runPlaygroundDemo();
})();
