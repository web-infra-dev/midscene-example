import {
  agentForRDPComputer,
  type RDPComputerAgentOpt,
} from '@midscene/computer';
import 'dotenv/config';

const rdpTarget = {
  host: 'REPLACE_WITH_YOUR_RDP_HOST',
  port: 3389,
  username: 'Admin',
  password: 'REPLACE_WITH_YOUR_RDP_PASSWORD',
  ignoreCertificate: true,
  adminSession: false,
  domain: undefined,
  securityProtocol: 'auto',
} satisfies RDPComputerAgentOpt;

function validateDemoConfig() {
  for (const [key, value] of Object.entries({
    host: rdpTarget.host,
    password: rdpTarget.password,
  })) {
    const trimmed = value?.trim();
    if (!trimmed || trimmed.startsWith('REPLACE_WITH_')) {
      throw new Error(
        `Please update rdpTarget.${key} in computer/rdp-demo/demo.ts before running the demo.`,
      );
    }
  }
}

async function waitForRemoteDesktopReady(
  agent: Awaited<ReturnType<typeof agentForRDPComputer>>,
  maxAttempts = 10,
  delayMs = 3_000,
) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await agent.aiAssert(
        'The remote screenshot is not a blank white screen. Some visible Windows UI such as the taskbar, desktop icons, the Start menu, or an application window is present.',
      );
      return;
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new Error(
    `The remote desktop never became visible after ${maxAttempts} attempts.`,
    { cause: lastError },
  );
}

async function main() {
  validateDemoConfig();

  const agent = await agentForRDPComputer({
    ...rdpTarget,
    aiActionContext:
      'You are controlling a remote Windows desktop directly through the RDP protocol. Every screenshot and action comes from the remote machine itself.',
    generateReport: true,
  });

  try {
    await waitForRemoteDesktopReady(agent);

    await agent.aiAct(
      'Click the Windows Start button, open the Settings app, then navigate to the Windows Update page. Stop only after the Windows Update page is clearly visible in the remote screenshot.',
    );

    await agent.aiAssert(
      'The Windows Update page inside the Settings app is open and visible in the remote screenshot.',
    );

    const windowsUpdateSummary = await agent.aiQuery<{
      pageTitle: string;
      statusSummary: string;
    }>(
      '{pageTitle: string, statusSummary: string}, read the visible Windows Update page and return its main page title and the short status summary shown near the top of the page.',
    );

    console.log('Connected to remote desktop:', rdpTarget.host);
    console.log('Windows Update page title:', windowsUpdateSummary.pageTitle);
    console.log('Windows Update status:', windowsUpdateSummary.statusSummary);
  } finally {
    await agent.destroy();
  }

  if (agent.reportFile) {
    console.log('Report saved to:', agent.reportFile);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
