import { expect } from "@playwright/test";
import { test } from "./fixture";

test.beforeEach(async ({ page }) => {
  await page.goto("https://todomvc.com/examples/react/dist/");
});

test("ai todo - Chinese Prompt", async ({ ai, aiQuery, aiAssert, aiTap }) => {
  // .ai - 通用 AI 操作方法
  await ai("在任务框 input 输入 今天学习 JS，按回车键");
  await ai("在任务框 input 输入 明天学习 Rust，按回车键");
  await ai("在任务框 input 输入后天学习 AI，按回车键");
  await ai("将鼠标移动到任务列表中的第二项，点击第二项任务右边的删除按钮");

  // .aiTap - 指定操作类型
  await aiTap("第二条任务左边的勾选按钮");
  await aiTap("任务列表下面的 completed 状态按钮");

  const list = await aiQuery("string[], 完整的任务列表");
  expect(list.length).toEqual(1);

  await aiAssert('列表下方有一个区域显示有 "1 item left"');
});
