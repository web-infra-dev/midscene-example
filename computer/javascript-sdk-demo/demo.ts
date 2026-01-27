import { agentFromComputer } from '@midscene/computer';
import 'dotenv/config';

const IS_MAC = process.platform === 'darwin';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Opens a browser and navigates to the specified URL
 */
async function openBrowserAndNavigate(
  agent: Awaited<ReturnType<typeof agentFromComputer>>,
  url: string,
): Promise<void> {
  if (IS_MAC) {
    await agent.aiAct('press Cmd+Space');
    await sleep(500);
    await agent.aiAct('type "Safari" and press Enter');
    await sleep(2000);
    await agent.aiAct('press Cmd+L to focus address bar');
  } else {
    await agent.aiAct('press Windows key');
    await sleep(500);
    await agent.aiAct('type "Chrome" and press Enter');
    await sleep(2000);
    await agent.aiAct('press Ctrl+L to focus address bar');
  }
  await sleep(300);

  await agent.aiAct(`type "${url}"`);
  await agent.aiAct('press Enter');
  await sleep(3000);
}

(async () => {
  const agent = await agentFromComputer({
    aiActionContext: 'If asked whether to save the password, click "Do Not Save" uniformly',
  });

  await openBrowserAndNavigate(agent, 'https://www.saucedemo.com/');

  // Wait for page to load
  await agent.aiAssert('The login form is visible');

  // Login
  await agent.aiAct('type "standard_user" in user name input');
  await agent.aiAct('type "secret_sauce" in password input');
  await agent.aiAct('click Login Button');
  await sleep(2000);

  // Check the login success
  await agent.aiAssert('the page title is "Swag Labs"');

  // Add to cart
  await agent.aiAct('click "add to cart" for black t-shirt products');
  await sleep(500);

  // Click cart icon
  await agent.aiAct('click right top cart icon');
  await sleep(1000);

  // Verify cart page loaded
  await agent.aiAssert('The cart page is displayed');

  console.log('Shop automation completed successfully!');
})();
