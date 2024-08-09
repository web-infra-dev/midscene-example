import { expect } from "@playwright/test";
import { test } from "./fixture";

test.beforeEach(async ({ page }) => {
  await page.goto("https://todomvc.com/examples/react/dist/");
});

test("ai todo - English Prompt - should fail", async ({
  ai,
  aiQuery,
  aiAssert,
}) => {
  await ai(
    "Input 'Study JS today' in the task box input and press the Enter key"
  );
  await ai(
    "Input 'Study Rust tomorrow' in the task box input and press the Enter key"
  );
  await ai(
    "Input 'Study AI the day after tomorrow' in the task box input and press the Enter key"
  );
  await ai(
    "Move the mouse to the second item in the task list and click the delete button on the right of the second task"
  );
  await ai("Click the check button on the left of the second task");
  await ai("Click the 'completed' status button below the task list");

  const list = await aiQuery("string[], the complete task list");

  expect(list.length).toEqual(1);

  // expect an error here. AI will give you the reason in error message.
  await aiAssert('At the bottom of the page, it shows "3 items left".');
});
