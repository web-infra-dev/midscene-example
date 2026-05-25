import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { PlaywrightAgent } from '@midscene/web/playwright';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import { parse, stringify } from 'yaml';

interface CustomYamlStepContext {
  agent: PlaywrightAgent;
  state: Record<string, unknown>;
  filePath: string;
  stepIndex: number;
  stepName: string;
}

type CustomYamlStepHandler = (
  value: unknown,
  context: CustomYamlStepContext,
) => Promise<void> | void;

interface MidsceneConfig {
  target: {
    type: 'web';
    options: {
      url: string;
      viewport?: {
        width: number;
        height: number;
      };
      headless?: boolean;
    };
  };
  testDir: string;
  include: string[];
  testRunner?: {
    maxConcurrency?: number;
    bail?: number;
    testTimeout?: number;
  };
  output?: {
    summary?: string;
  };
  agentOptions?: Record<string, unknown>;
  yamlSteps?: Record<string, CustomYamlStepHandler>;
}

interface SetupResult {
  agent: PlaywrightAgent;
  browser: Browser;
  context: BrowserContext;
  page: Page;
  teardown: () => Promise<void>;
}

const builtinStepNames = new Set([
  'ai',
  'aiAct',
  'aiAssert',
  'aiQuery',
  'aiInput',
  'aiTap',
  'aiHover',
  'aiScroll',
  'aiKeyboardPress',
  'sleep',
]);

async function createDefaultWebSetup(config: MidsceneConfig): Promise<SetupResult> {
  if (config.target.type !== 'web') {
    throw new Error('custom-yaml-steps-demo expects target.type to be web');
  }

  const browser = await chromium.launch({
    headless: config.target.options.headless ?? true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    viewport: config.target.options.viewport,
  });

  const page = await context.newPage();
  await page.goto(config.target.options.url);
  const agent = new PlaywrightAgent(page, config.agentOptions);

  return {
    agent,
    browser,
    context,
    page,
    async teardown() {
      await context.close();
      await browser.close();
    },
  };
}

async function loadYamlFile<T>(filePath: string): Promise<T> {
  return parse(await readFile(filePath, 'utf-8')) as T;
}

async function collectYamlFiles(testDir: string, include: string[]): Promise<string[]> {
  const files: string[] = [];
  const shouldIncludeYaml = include.some((pattern) => pattern.endsWith('.yaml'));

  async function walk(dir: string) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const entryPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(entryPath);
        continue;
      }

      if (shouldIncludeYaml && entry.name.endsWith('.yaml')) {
        files.push(entryPath);
      }
    }
  }

  await walk(testDir);
  return files.sort();
}

function readSingleStep(step: unknown, file: string, stepIndex: number) {
  if (!step || typeof step !== 'object' || Array.isArray(step)) {
    throw new Error(`${file} step ${stepIndex + 1} must be an object`);
  }

  const entries = Object.entries(step as Record<string, unknown>);
  if (entries.length !== 1) {
    throw new Error(`${file} step ${stepIndex + 1} must contain exactly one key`);
  }

  const [stepName, value] = entries[0];
  return { stepName, value };
}

async function runBuiltinStep(agent: PlaywrightAgent, step: unknown, caseName: string) {
  await agent.runYaml(
    stringify({
      tasks: [
        {
          name: caseName,
          flow: [step],
        },
      ],
    }),
  );
}

async function runCase(
  filePath: string,
  config: MidsceneConfig,
  setupResult: SetupResult,
  state: Record<string, unknown>,
) {
  const cwd = process.cwd();
  const file = relative(cwd, filePath);
  const caseYaml = await loadYamlFile<{ flow: unknown[] }>(filePath);
  if (!Array.isArray(caseYaml.flow)) {
    throw new Error(`${file} must include a top-level flow array`);
  }

  const caseName = basename(file, extname(file));
  for (const [stepIndex, step] of caseYaml.flow.entries()) {
    const { stepName, value } = readSingleStep(step, file, stepIndex);

    if (builtinStepNames.has(stepName)) {
      await runBuiltinStep(setupResult.agent, step, `${caseName}:${stepName}`);
      continue;
    }

    const customStep = config.yamlSteps?.[stepName];
    if (!customStep) {
      throw new Error(`${file} step ${stepIndex + 1} uses unknown step "${stepName}"`);
    }

    console.log(`Running custom step ${stepName}`);
    await customStep(value, {
      agent: setupResult.agent,
      state,
      filePath: file,
      stepIndex,
      stepName,
    });
  }
}

async function main() {
  const cwd = process.cwd();
  const configModule = await import(pathToFileURL(resolve(cwd, 'midscene.config.ts')).href);
  const config = configModule.default as MidsceneConfig;
  const setupResult = await createDefaultWebSetup(config);
  const files = await collectYamlFiles(resolve(cwd, config.testDir), config.include);
  const state: Record<string, unknown> = {};
  const results: Array<{ file: string; status: 'passed' | 'failed'; error?: string }> = [];

  try {
    for (const filePath of files) {
      const file = relative(cwd, filePath);
      console.log(`\nRunning ${file}`);
      try {
        await runCase(filePath, config, setupResult, state);
        results.push({ file, status: 'passed' });
      } catch (error) {
        results.push({
          file,
          status: 'failed',
          error: error instanceof Error ? error.message : String(error),
        });

        const failedCount = results.filter((result) => result.status === 'failed').length;
        const bail = config.testRunner?.bail ?? 0;
        if (bail > 0 && failedCount >= bail) {
          throw error;
        }
      }
    }

    if (config.output?.summary) {
      const summaryPath = resolve(cwd, config.output.summary);
      await mkdir(dirname(summaryPath), { recursive: true });
      await writeFile(
        summaryPath,
        JSON.stringify(
          {
            passed: results.filter((result) => result.status === 'passed').length,
            failed: results.filter((result) => result.status === 'failed').length,
            results,
          },
          null,
          2,
        ),
      );
    }
  } finally {
    await setupResult.teardown();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
