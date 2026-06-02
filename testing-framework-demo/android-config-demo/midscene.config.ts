import type { AndroidAgent } from '@midscene/android';

export interface MidsceneConfig {
  target: {
    type: 'android';
    options: {
      deviceId?: string;
      launch?: string;
      androidAdbPath?: string;
      remoteAdbHost?: string;
      remoteAdbPort?: number;
      autoDismissKeyboard: boolean;
      imeStrategy: 'yadb-for-non-ascii' | 'always-yadb';
    };
  };
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
    cache: boolean | { id: string };
    reportFileName: string;
  };
  setup?: (context: {
    agentOptions: MidsceneConfig['agentOptions'];
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
  target: {
    type: 'android',
    options: {
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
  },

  testDir: './e2e',
  include: ['**/*.yaml'],

  testRunner: {
    maxConcurrency: 1,
    bail: 0,
    // Real-device interactions over adb (screencap + pull per step) are slower
    // than the web demos, so give the case a larger budget.
    testTimeout: 300_000,
  },

  output: {
    summary: './midscene_run/output/summary.json',
  },

  agentOptions: {
    aiActionContext:
      'This is an Android smoke test. If a permission dialog appears, accept it.',
    cache: { id: 'android-config-demo' },
    reportFileName: 'android-config-demo',
  },
});
