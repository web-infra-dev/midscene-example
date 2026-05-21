import { readFile } from 'node:fs/promises';
import { basename, extname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse, stringify } from 'yaml';

interface SuiteConfig {
  setup: string;
  files: string[];
}

interface SetupResult {
  agent: {
    runYaml: (yamlScriptContent: string) => Promise<unknown>;
  };
  freeFn?: Array<() => Promise<void>>;
}

async function loadYamlFile<T>(filePath: string): Promise<T> {
  return parse(await readFile(filePath, 'utf-8')) as T;
}

async function main() {
  const cwd = process.cwd();
  const configPath = resolve(cwd, 'config.yml');
  const config = await loadYamlFile<SuiteConfig>(configPath);

  if (!config.setup || !Array.isArray(config.files)) {
    throw new Error('config.yml must include setup and files');
  }

  const setupModule = await import(pathToFileURL(resolve(cwd, config.setup)).href);
  const setup = setupModule.default as () => Promise<SetupResult>;
  const setupResult = await setup();

  try {
    for (const file of config.files) {
      const filePath = resolve(cwd, file);
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
      await setupResult.agent.runYaml(runnableYaml);
    }
  } finally {
    for (const free of setupResult.freeFn ?? []) {
      await free();
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

