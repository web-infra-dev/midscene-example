import { test } from "./fixture";

test.beforeEach(async ({ page }) => {
  await page.goto("https://todomvc.com/examples/react/dist/");
});

test("ai todo - Chinese Prompt", async ({ ai, aiQuery, aiAssert, aiTap, aiHover }) => {
  // .ai - 通用 AI 操作方法
  await ai("在任务框 input 输入 今天学习 JS，按回车键");
  await ai("在任务框 input 输入 明天学习 Rust，按回车键");
  await ai("在任务框 input 输入后天学习 AI，按回车键");

  // .aiTap, .aiHover - 即时操作接口
  await aiHover('任务列表中的第二项');
  await aiTap("第二项任务右边的删除按钮");

  await aiTap("第二条任务左边的勾选按钮");
  await aiTap("任务列表下面的 completed 状态按钮");

  await aiAssert('列表下方有一个区域显示有 "1 item left"');
});
