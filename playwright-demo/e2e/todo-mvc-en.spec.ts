import { expect } from "@playwright/test";
import { test } from "./fixture";

test.beforeEach(async ({ page }) => {
  await page.goto("https://todomvc.com/examples/react/dist/");
});

test("ai todo - English Prompt", async ({ ai, aiQuery, aiAssert, aiTap }) => {
  // .ai - general AI operation method
  await ai(
    "Input 'Learn JS today' in the task box input and press the Enter key"
  );
  await ai(
    "Input 'Learn Rust tomorrow' in the task box input and press the Enter key"
  );
  await ai(
    "Input 'Learn AI the day after tomorrow' in the task box input and press the Enter key"
  );
  await ai(
    "Move the mouse to the second item in the task list and click the delete button on the right of the second task"
  );

  // .aiTap - specify the operation type
  await aiTap("the check button on the left of the second task");
  await aiTap("the 'completed' status button below the task list");

  const list = await aiQuery("string[], the complete task list");

  expect(list.length).toEqual(1);

  await aiAssert(
    'Near the bottom of the list, there is a tip shows "1 item left".'
  );
});
