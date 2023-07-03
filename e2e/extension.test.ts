import { test, expect } from "./fixtures";

test("extension", async ({ popup, page }) => {
  await test.step("configure popup: order HTML files first sorted by fewest changes and collapsed", async () => {
    await popup.getByRole("button", { name: "Add row" }).first().click();
    await popup.getByRole("textbox", { name: "Glob" }).fill("*.html");
    await popup
      .getByRole("combobox", { name: "Sort" })
      .first()
      .selectOption("fewest-changes");
    await popup.getByRole("checkbox", { name: "Collapse" }).first().check();
  });

  await test.step("check Github comparison view", async () => {
    await page.goto("https://github.com/YellowKirby/gh-file-sort/pull/7/files");
    const fileEls = await page
      .locator("css=.js-file[data-tagsearch-path]")
      .all();
    const paths = await Promise.all(
      fileEls.map((file) => file.getAttribute("data-tagsearch-path"))
    );
    expect(paths).toEqual([
      "src/popup/index.html",
      "src/content-script/content-script.ts",
      "src/popup/Popup.svelte",
    ]);
  });
});
