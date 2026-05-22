import { type AndroidAgent, agentFromAdbDevice } from '@midscene/android';

export interface MidsceneConfig {
  platform: 'android';
  testDir: string;
  include: string[];
  testRunner: {
    maxConcurrency: number;
    bail: number;
    testTimeout: number;
  };
  output: {
    summary: string;
  };
  agentOptions: {
    aiActionContext: string;
    cache: boolean;
    reportFileName: string;
  };
  runtimeOptions: {
    deviceId?: string;
    launch?: string;
    androidAdbPath?: string;
    remoteAdbHost?: string;
    remoteAdbPort?: number;
    autoDismissKeyboard: boolean;
    imeStrategy: 'yadb-for-non-ascii' | 'always-yadb';
  };
  setup: (context: {
    agentOptions: MidsceneConfig['agentOptions'];
    runtimeOptions: MidsceneConfig['runtimeOptions'];
  }) => Promise<SetupResult>;
}

export interface SetupResult {
  agent: AndroidAgent;
  teardown: () => Promise<void>;
}

function defineMidsceneConfig(config: MidsceneConfig): MidsceneConfig {
  return config;
}

export default defineMidsceneConfig({
  platform: 'android',
  testDir: './e2e',
  include: ['**/*.yaml'],

  testRunner: {
    maxConcurrency: 1,
    bail: 0,
    testTimeout: 120_000,
  },

  output: {
    summary: './midscene_run/output/summary.json',
  },

  agentOptions: {
    aiActionContext:
      'This is an Android smoke test. If a permission dialog appears, accept it.',
    cache: true,
    reportFileName: 'android-config-demo',
  },

  runtimeOptions: {
    deviceId: process.env.ANDROID_DEVICE_ID,
    launch: process.env.ANDROID_LAUNCH_TARGET ?? 'https://www.ebay.com',
    androidAdbPath: process.env.ANDROID_ADB_PATH,
    remoteAdbHost: process.env.ANDROID_REMOTE_ADB_HOST,
    remoteAdbPort: process.env.ANDROID_REMOTE_ADB_PORT
      ? Number(process.env.ANDROID_REMOTE_ADB_PORT)
      : undefined,
    autoDismissKeyboard: false,
    imeStrategy: 'yadb-for-non-ascii',
  },

  async setup({ agentOptions, runtimeOptions }) {
    const { deviceId, launch, ...deviceOptions } = runtimeOptions;
    const agent = await agentFromAdbDevice(deviceId, {
      ...agentOptions,
      ...deviceOptions,
    });

    if (launch) {
      await agent.launch(launch);
    }

    return {
      agent,
      async teardown() {
        if (launch && !launch.startsWith('http')) {
          await agent.terminate(launch);
        }
      },
    };
  },
});
