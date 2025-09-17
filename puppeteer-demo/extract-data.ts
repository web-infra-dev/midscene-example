import puppeteer from 'puppeteer';
import os from 'node:os';
import { PuppeteerAgent } from '@midscene/web/puppeteer';
import 'dotenv/config'; // read environment variables from .env file

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

Promise.resolve(
  (async () => {
    const browser = await puppeteer.launch({
      headless: false, // set to 'false' to see the browser window for demo
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1280,
      height: 768,
      deviceScaleFactor: os.platform() === 'darwin' ? 2 : 1,
    });

    // Load the contacts demo page (replace with your actual file path or URL)
    await page.goto(
      'https://lf3-static.bytednsdoc.com/obj/eden-cn/nupipfups/Midscene/contacts3.html'
    );

    // await sleep(2000);

    // 🤖 Initialize Midscene agent
    const agent = new PuppeteerAgent(page);

    console.log('🚀 Starting Smart Contacts Demo with Midscene AI');
    console.log('================================================');

    // ✨ FEATURE DEMO 1: aiRightClick - Right-click on a contact
    console.log('\n1. 🖱️ Testing aiRightClick feature...');
    await agent.aiRightClick('Alice Johnson', { deepThink: true });
    await sleep(1000);
    console.log(
      "✅ Successfully right-clicked on Alice Johnson's contact card"
    );

    // Click on "Copy Info" option in context menu
    await agent.aiTap('Copy Info');
    await sleep(1000);
    console.log(
      "✅ Successfully triggered 'Copy Info' action from context menu"
    );

    // ✨ FEATURE DEMO 2: aiQuery with domIncluded - Extract contact data including hidden attributes
    console.log('\n2. 📊 Testing aiQuery with domIncluded feature...');
    const contactsData = await agent.aiQuery<
      Array<{
        name: string;
        id: number;
        company: string;
        department: string;
        avatarUrl: string;
      }>
    >(
      '{name: string, id: number, company: string, department: string, avatarUrl: string}[], extract all contact information including hidden avatarUrl attributes',
      { domIncluded: true }
    );
    console.log(
      '✅ Successfully extracted contact data with hidden attributes:'
    );
    console.log(JSON.stringify(contactsData, null, 2));

    // ✨ FEATURE DEMO 3: aiBoolean with domIncluded - Check for ID fields
    console.log('\n3. ❓ Testing aiBoolean with domIncluded feature...');
    const isId1 = await agent.aiBoolean("is First contact's id is 1?", {
      domIncluded: true,
    });
    console.log("✅ Is First contact's id is 1?", isId1);

    // ✨ FEATURE DEMO 4: aiNumber - with domIncluded - Count contacts
    console.log('\n4. 🔢 Testing aiNumber with domIncluded feature...');
    const contactCount = await agent.aiNumber("First contact's id?", {
      domIncluded: true,
    });
    console.log("✅ First contact's id:", contactCount);

    // ✨ FEATURE DEMO 5: aiString with domIncluded - Get first contact's ID
    console.log('\n5. 🆔 Testing aiString with domIncluded feature...');
    const firstContactId = await agent.aiString(
      'What is the Avatar URL of the first contact?',
      { domIncluded: true }
    );
    console.log("✅ First contact's Avatar URL:", firstContactId);

    console.log('\n🎉 Smart Contacts Demo completed!');
    console.log('================================================');
    console.log('✨ Midscene features demonstrated:');
    console.log('   • aiRightClick() with deepThink - Custom context menus');
    console.log(
      '   • aiQuery() with domIncluded - Extract hidden ID attributes'
    );
    console.log('   • aiBoolean() with domIncluded - DOM-based boolean checks');
    console.log('   • aiNumber() - with domIncluded - Hidden ID attributes');
    console.log(
      '   • aiString() with domIncluded - Extract hidden Avatar URL values'
    );

    // Keep browser open for a few seconds to see the results
    await sleep(3000);
    await browser.close();
  })()
);
