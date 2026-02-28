import { agentFromHdcDevice, getConnectedDevices } from '@midscene/harmony';
import { describe, it, vi } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 90 * 1000,
});

describe(
  'harmony integration',
  async () => {
    await it('HarmonyOS settings page demo for scroll', async () => {
      const devices = await getConnectedDevices();
      const agent = await agentFromHdcDevice(devices[0].deviceId);

      await agent.launch('Settings');

      await agent.aiAct('scroll list to bottom');
      await agent.aiAct('open "Bluetooth" settings');
      await agent.aiAct('scroll list to bottom');
      await agent.aiAct('scroll list to top');
      await agent.aiAct('swipe down one screen');
      await agent.aiAct('swipe up one screen');
    });
  },
  360 * 1000,
);
