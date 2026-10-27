import { defineTestProject } from '@midscene/test/config';
import {
  type Context,
  type SharedContext,
  androidFileSetup,
  androidSetup,
  iosFileSetup,
  iosSetup,
  nodes,
  webFileSetup,
  webSetup,
} from './setup';

const serial = process.env.SERIAL === '1';

// One Project per platform; each file owns a separate browser session or device.
export default defineTestProject<Context, SharedContext>({
  nodes,
  projects: [
    {
      name: 'web',
      setup: webSetup,
      fileSetup: webFileSetup,
      files: { include: ['generated/web/*.yaml'] },
      maxConcurrentFiles: serial ? 1 : 2,
    },
    {
      name: 'android',
      setup: androidSetup,
      fileSetup: androidFileSetup,
      files: { include: ['generated/android/*.yaml'] },
      maxConcurrentFiles: serial ? 1 : 2,
    },
    {
      name: 'ios',
      setup: iosSetup,
      fileSetup: iosFileSetup,
      files: { include: ['generated/ios/*.yaml'] },
      maxConcurrentFiles: serial ? 1 : 2,
    },
  ],
  test: {
    maxConcurrentProjects: serial ? 1 : 3,
    maxConcurrentFiles: serial ? 1 : 6,
    setupTimeout: 120_000,
    testTimeout: 600_000,
  },
});
