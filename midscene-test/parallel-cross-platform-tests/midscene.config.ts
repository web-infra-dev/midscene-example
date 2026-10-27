import { defineTestProject } from '@midscene/test/config';
import { androidSetup, iosSetup, nodes, webSetup } from './setup';

// One Project owns one browser/device. Its YAML files run sequentially.
export default defineTestProject({
  nodes,
  projects: [
    {
      name: 'web',
      setup: webSetup,
      files: { include: ['cases/*.yaml'] },
      maxConcurrentFiles: 1,
    },
    {
      name: 'android',
      setup: androidSetup,
      files: { include: ['cases/*.yaml'] },
      maxConcurrentFiles: 1,
    },
    {
      name: 'ios',
      setup: iosSetup,
      files: { include: ['cases/*.yaml'] },
      maxConcurrentFiles: 1,
    },
  ],
  test: {
    maxConcurrentProjects: process.env.SERIAL === '1' ? 1 : 3,
    maxConcurrentFiles: process.env.SERIAL === '1' ? 1 : 3,
    setupTimeout: 120_000,
    testTimeout: 600_000,
  },
});
