import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadEnv } from 'dotenv';
import { publicHost } from './server/lan';
import { startTodoService } from './server/service';

loadEnv({ path: new URL('./.env', import.meta.url), quiet: true });
loadEnv({ path: new URL('../../.env', import.meta.url), quiet: true });

async function main() {
  const server = await startTodoService({
    port: Number(process.env.SHOWCASE_PORT || 0),
  });
  try {
    const publicUrl = `http://${publicHost()}:${server.port}`;
    console.log(`Shared Todo service: ${publicUrl}`);
    const require = createRequire(import.meta.url);
    const bin = resolve(
      dirname(require.resolve('@midscene/test')),
      '../../bin/midscene-test',
    );
    const child = spawn(
      process.execPath,
      [bin, ...process.argv.slice(2).filter((arg) => arg !== '--')],
      {
        cwd: fileURLToPath(new URL('.', import.meta.url)),
        stdio: 'inherit',
        env: {
          ...process.env,
          TODO_LOCAL_URL: server.localUrl,
          TODO_PUBLIC_URL: publicUrl,
        },
      },
    );
    const interrupt = () => child.kill('SIGINT');
    const terminate = () => child.kill('SIGTERM');
    process.on('SIGINT', interrupt);
    process.on('SIGTERM', terminate);
    try {
      process.exitCode = await new Promise<number>((resolve, reject) => {
        child.once('error', reject);
        child.once('exit', (code) => resolve(code ?? 1));
      });
    } finally {
      process.off('SIGINT', interrupt);
      process.off('SIGTERM', terminate);
    }
  } finally {
    await server.close();
  }
}

await main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
