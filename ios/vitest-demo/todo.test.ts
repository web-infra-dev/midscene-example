import { agentFromWebDriverAgent } from '@midscene/ios';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import 'dotenv/config'; // read environment variables from .env file

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

vi.setConfig({
  testTimeout: 240 * 1000,
});

const pageUrl = 'https://todomvc.com/examples/react/dist/';

describe('Test todo list', () => {
  let agent: IOSAgent;

  beforeAll(async () => {
    agent = await agentFromWebDriverAgent({
      aiActionContext:
        'If any location, permission, user agreement, etc. popup, click agree. If login page pops up, close it.',
    });
    await agent.launch(pageUrl);
    await sleep(3000);
  });

  it(
    'ai todo',
    async () => {
      await agent.aiAction(
        "type 'Study JS today' in the task box input and press the Enter key",
      );
      await agent.aiAction(
        "type 'Study Rust tomorrow' in the task box input and press the Enter key",
      );
      await agent.aiAction(
        "type 'Study AI the day after tomorrow' in the task box input and press the Enter key",
      );
      await agent.aiAction(
        'move the mouse to the second item in the task list and click the delete button on the right of the second task',
      );
      await agent.aiAction(
        'click the check button on the left of the second task',
      );
      await agent.aiAction(
        "click the 'completed' status button below the task list",
      );

      const list = await agent.aiQuery('string[], the complete task list');
      expect(list.length).toEqual(1);

      await agent.aiAssert(
        'Near the bottom of the list, there is a tip shows "1 item left".',
      );

      const name = await agent.aiString('What is the name of the first todo?');
      console.log('name', name);

      const todoCount = await agent.aiNumber('How many todos are there in the list?');
      console.log('todoCount', todoCount);

      const isAllCompleted = await agent.aiBoolean('Is all todos completed?');
      console.log('isAllCompleted', isAllCompleted);

      const location = await agent.aiLocate('What is the location of the first todo?');
      console.log('location', location);
    },
    720 * 1000,
  );
});
