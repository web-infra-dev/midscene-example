import path from 'path';
import { moduleTools, defineConfig } from '@modern-js/module-tools';
import { testingPlugin } from '@modern-js/plugin-testing';

export default defineConfig({
  plugins: [moduleTools(), testingPlugin()],
  buildPreset: 'npm-library-es2019',
  testing: {
    jest: {
      testEnvironment: 'node',
    },
  },
});
