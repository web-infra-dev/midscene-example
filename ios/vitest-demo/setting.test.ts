import { agentFromWebDriverAgent } from '@midscene/ios';
import { describe, it, vi } from 'vitest';
import 'dotenv/config'; // read environment variables from .env file



vi.setConfig({
  testTimeout: 90 * 1000,
});

describe(
  'ios integration',
  async () => {
    await it('iOS settings page demo for scroll', async () => {
      const agent = await agentFromWebDriverAgent({
        aiActContext:
          'If any location, permission, user agreement, etc. popup, click agree. If login page pops up, close it.',
      });

      await agent.launch('com.apple.Preferences');


      await agent.aiAct('scroll list to bottom');
      await agent.aiAct('open "More settings"');
      await agent.aiAct('scroll list to bottom');
      await agent.aiAct('scroll list to top');
      await agent.aiAct('swipe down one screen');
      await agent.aiAct('swipe up one screen');
    });
  },
  360 * 1000,
);
