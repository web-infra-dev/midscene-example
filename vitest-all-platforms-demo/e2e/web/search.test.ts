import { describe, expect, it } from "vitest";
import { WebTest } from "../../src/context";

describe("Bing Search", () => {
  const ctx = WebTest.setup("https://bing.com");
  it("should search successfully for Midscene", async () => {
    await ctx.agent.aiAct('Type "Midscene" in the search box, then click the search button, check the page title contains "Midscene"');
  });
});
