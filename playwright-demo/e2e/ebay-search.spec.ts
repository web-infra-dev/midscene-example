import { expect } from "@playwright/test";
import { test } from "./fixture";

test.beforeEach(async ({ page }) => {
  page.setViewportSize({ width: 1280, height: 768 });
  await page.goto("https://www.ebay.com");
  await page.waitForLoadState("networkidle");
});

test("search headphone on ebay", async ({
  ai,
  aiQuery,
  aiAssert,
  aiWaitFor,
}) => {
  // 👀 type keywords, perform a search
  await ai('type "Headphones" in search box, hit Enter');

  // 👀 wait for the loading
  await aiWaitFor("there is at least one headphone item on page");

  // 👀 find the items
  const items = await aiQuery(
    "{itemTitle: string, price: Number}[], find item in list and corresponding price"
  );

  console.log("headphones in stock", items);
  expect(items?.length).toBeGreaterThan(0);

  // 👀 assert by AI
  await aiAssert("There is a category filter on the left");
});
