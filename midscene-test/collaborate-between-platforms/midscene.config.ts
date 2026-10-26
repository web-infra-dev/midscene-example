import { defineTestProject } from '@midscene/test/config';
import { nodes } from './nodes';
import { type Context, androidSetup, iosSetup } from './setup';

export default defineTestProject<Context>({
  nodes,
  projects: [
    {
      name: 'android-web',
      setup: androidSetup,
      files: { include: ['cases/handoff.yaml'] },
      maxConcurrentFiles: 1,
    },
    {
      name: 'ios-web',
      setup: iosSetup,
      files: { include: ['cases/handoff.yaml'] },
      maxConcurrentFiles: 1,
    },
  ],
  test: {
    maxConcurrentProjects: process.env.SERIAL === '1' ? 1 : 2,
    maxConcurrentFiles: process.env.SERIAL === '1' ? 1 : 2,
    setupTimeout: 120_000,
    testTimeout: 600_000,
  },
});
