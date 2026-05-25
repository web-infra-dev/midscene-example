import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse, stringify } from 'yaml';

interface MidsceneConfig {
  target?: {
    type: 'android';
    options: Record<string, unknown>;
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
  setup?: (context: {
    agentOptions: Record<string, unknown>;
  }) => Promise<SetupResult>;
}

interface SetupResult {
  agent: {
    runYaml: (yamlScriptContent: string) => Promise<unknown>;
  };
  teardown?: () => Promise<void>;
}

async function createDefaultAndroidSetup(config: MidsceneConfig): Promise<SetupResult> {
  if (config.target?.type !== 'android') {
    throw new Error('android-config-demo expects target.type to be android');
  }

  const { agentFromAdbDevice } = await import('@midscene/android');
  const { deviceId, launch, ...deviceOptions } = config.target.options;
  const agent = await agentFromAdbDevice(
    typeof deviceId === 'string' ? deviceId : undefined,
    {
      ...config.agentOptions,
      ...deviceOptions,
    },
  );

  if (typeof launch === 'string' && launch) {
    await agent.launch(launch);
  }

  return {
    agent,
    async teardown() {
      if (typeof launch === 'string' && launch && !launch.startsWith('http')) {
        await agent.terminate(launch);
      }
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

async function runWithConcurrency<T>(
  items: T[],
  concurrency: number,
  run: (item: T) => Promise<void>,
) {
  const workers = Array.from({ length: Math.max(1, concurrency) }, async (_, workerIndex) => {
    for (let index = workerIndex; index < items.length; index += Math.max(1, concurrency)) {
      await run(items[index]);
    }
  });

  await Promise.all(workers);
}

async function main() {
  const cwd = process.cwd();
  const configModule = await import(pathToFileURL(resolve(cwd, 'midscene.config.ts')).href);
  const config = configModule.default as MidsceneConfig;

  const setupResult = config.setup
    ? await config.setup({
        agentOptions: config.agentOptions ?? {},
      })
    : await createDefaultAndroidSetup(config);
  const files = await collectYamlFiles(resolve(cwd, config.testDir), config.include);
  const results: Array<{ file: string; status: 'passed' | 'failed'; error?: string }> = [];

  try {
    await runWithConcurrency(files, config.testRunner?.maxConcurrency ?? 1, async (filePath) => {
      const file = relative(cwd, filePath);
      const caseYaml = await loadYamlFile<{ flow: unknown[] }>(filePath);
      if (!Array.isArray(caseYaml.flow)) {
        throw new Error(`${file} must include a top-level flow array`);
      }

      const name = basename(file, extname(file));
      const runnableYaml = stringify({
        tasks: [
          {
            name,
            flow: caseYaml.flow,
          },
        ],
      });

      console.log(`\nRunning ${file}`);
      try {
        await setupResult.agent.runYaml(runnableYaml);
        results.push({ file, status: 'passed' });
      } catch (error) {
        results.push({
          file,
          status: 'failed',
          error: error instanceof Error ? error.message : String(error),
        });

        const bail = config.testRunner?.bail ?? 0;
        const failedCount = results.filter((result) => result.status === 'failed').length;
        if (bail > 0 && failedCount >= bail) {
          throw error;
        }
      }
    });

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
    await setupResult.teardown?.();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
