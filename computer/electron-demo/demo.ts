import { execSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { agentFromComputer } from '@midscene/computer';
import 'dotenv/config';

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const DEMO_DIR = resolve(import.meta.dirname);
const VAULT_DIR = join(DEMO_DIR, 'obsidian-vault');

/**
 * Locate the Obsidian binary. If only an AppImage is found, extract it first.
 * Returns the path to the executable.
 */
function findOrPrepareApp(): string {
  // Already extracted
  const extractedBin = join(DEMO_DIR, 'squashfs-root', 'obsidian');
  if (existsSync(extractedBin)) {
    console.log('Using previously extracted Obsidian binary');
    return extractedBin;
  }

  // Find AppImage in the demo directory
  const appImages = readdirSync(DEMO_DIR).filter((f) =>
    f.endsWith('.AppImage'),
  );
  if (appImages.length === 0) {
    throw new Error(
      'No Obsidian AppImage found. Download it to the electron-demo directory first.',
    );
  }

  const appImagePath = join(DEMO_DIR, appImages[0]);
  console.log(`Extracting ${appImages[0]} ...`);
  execSync(`chmod +x "${appImagePath}"`);
  execSync(`"${appImagePath}" --appimage-extract`, { cwd: DEMO_DIR });
  console.log('Extraction complete');

  if (!existsSync(extractedBin)) {
    throw new Error('Extraction succeeded but obsidian binary not found');
  }
  return extractedBin;
}

/**
 * Pre-seed Obsidian config so it opens our vault directly (skipping the vault picker).
 */
function preseedVault(vaultDir: string): void {
  mkdirSync(vaultDir, { recursive: true });

  const configDir = join(homedir(), '.config', 'obsidian');
  mkdirSync(configDir, { recursive: true });

  const obsidianJson = join(configDir, 'obsidian.json');
  const vaultId = 'ci-test-vault';
  const config = {
    vaults: {
      [vaultId]: {
        path: vaultDir,
        ts: Date.now(),
        open: true,
      },
    },
  };
  writeFileSync(obsidianJson, JSON.stringify(config, null, 2));
  console.log(`Vault config written to ${obsidianJson}`);
}

/**
 * Launch Obsidian as a detached child process with Electron-friendly flags.
 */
function launchApp(
  binaryPath: string,
  vaultDir: string,
): ReturnType<typeof spawn> {
  const args = [
    `--vault=${vaultDir}`,
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
  ];
  console.log(`Launching: ${binaryPath} ${args.join(' ')}`);

  const child = spawn(binaryPath, args, {
    detached: true,
    stdio: 'ignore',
    env: { ...process.env, ELECTRON_DISABLE_SECURITY_WARNINGS: 'true' },
  });
  child.unref();
  return child;
}

(async () => {
  // --- Prepare app binary & vault config ---
  const binaryPath = findOrPrepareApp();
  preseedVault(VAULT_DIR);

  // --- Connect Midscene agent FIRST (this starts Xvfb on headless Linux) ---
  const agent = await agentFromComputer({
    aiActionContext:
      'You are interacting with Obsidian, a note-taking desktop application. ' +
      'If any dialog or popup appears, dismiss it by clicking the close button or pressing Escape.',
  });

  // --- Launch Obsidian AFTER Xvfb is ready (DISPLAY is now set) ---
  const child = launchApp(binaryPath, VAULT_DIR);
  console.log(`Obsidian launched (pid: ${child.pid})`);

  // Give Obsidian time to start up
  await sleep(10000);

  try {
    // Wait for the main UI to appear
    await agent.aiWaitFor(
      'Obsidian main window is visible with the editor area or vault view',
      { timeoutMs: 30000 },
    );
    console.log('Obsidian UI is ready');

    // Dismiss any welcome dialogs / popups
    await agent.aiAct(
      'If there is any popup, modal dialog, or "Trust author" prompt, close or dismiss it',
    );
    await sleep(1000);

    // Create a new note
    await agent.aiAct('press Ctrl+N to create a new note');
    await sleep(1500);

    // Type note content
    await agent.aiAct('type "Hello from Midscene CI" in the editor');
    await sleep(1000);

    // Verify the note content
    const result = await agent.aiQuery(
      '{ content: string } — read the text content currently visible in the editor area',
    );
    console.log('Editor content:', JSON.stringify(result));

    if (
      typeof result?.content === 'string' &&
      result.content.includes('Midscene')
    ) {
      console.log('Content verification passed!');
    } else {
      console.warn('Content verification: text may not match expected value');
    }

    // --- Install community plugin: LifeOS ---
    console.log('Opening Obsidian settings...');
    await agent.aiAct('press Ctrl+Comma to open Settings');
    await sleep(2000);

    await agent.aiWaitFor('Settings dialog is visible', { timeoutMs: 15000 });

    // Navigate to Community plugins
    await agent.aiAct(
      'click "Community plugins" in the left sidebar of the settings dialog',
    );
    await sleep(1500);

    // Turn on community plugins if not enabled
    await agent.aiAct(
      'If there is a "Turn on community plugins" button, click it. ' +
        'If a confirmation dialog appears, click "Turn on" to confirm.',
    );
    await sleep(1500);

    // Open the plugin browser
    await agent.aiAct('click "Browse" button to open the community plugin browser');
    await sleep(3000);

    await agent.aiWaitFor(
      'Community plugin browser / marketplace is visible with a search box',
      { timeoutMs: 20000 },
    );
    console.log('Community plugin browser is open');

    // Search for LifeOS
    await agent.aiAct('type "lifeos" in the search box');
    await sleep(3000);

    // Click the LifeOS plugin from results
    await agent.aiAct('click on the "LifeOS" plugin in the search results');
    await sleep(2000);

    // Install the plugin
    await agent.aiAct('click the "Install" button');
    await sleep(5000);

    // Verify installation
    await agent.aiWaitFor(
      'The "Install" button has changed to "Enable" or "Installed", indicating the plugin was installed',
      { timeoutMs: 30000 },
    );
    console.log('LifeOS plugin installed successfully!');

    console.log('Electron demo completed successfully!');
  } finally {
    if (child.pid) {
      try {
        process.kill(-child.pid, 'SIGKILL');
      } catch {
        // Process may have already exited
      }
    }
    // Force immediate exit without triggering Xlib cleanup (which causes XIO fatal error)
    setTimeout(() => process.kill(process.pid, 'SIGKILL'), 500);
  }
})();
