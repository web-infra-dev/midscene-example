import { agentFromAdbDevice, getConnectedDevices } from '@midscene/android';
import { describe, it, vi } from 'vitest';
import 'dotenv/config'; // read environment variables from .env file

vi.setConfig({
  testTimeout: 90 * 1000,
});

describe(
  'android integration',
  async () => {
    await it('Android settings page demo for scroll', async () => {
      const devices = await getConnectedDevices();
      const agent = await agentFromAdbDevice(devices[0].udid, {
        aiActContext:
          'If any location, permission, user agreement, etc. popup, click agree. If login page pops up, close it.',
      });

      await agent.launch('com.android.settings/.Settings');

      await agent.aiAct('scroll list to bottom');
      await agent.aiAct('open "More settings"');
      await agent.aiAct('scroll list to bottom');
      await agent.aiAct('scroll list to top');
      await agent.aiAct('swipe down one screen');
      await agent.aiAct('swipe up one screen');
    });
  },
  360 * 1000
);
