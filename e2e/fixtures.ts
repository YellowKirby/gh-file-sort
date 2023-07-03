import { test as base, chromium, BrowserContext, Page } from "@playwright/test";
import path from "path";

export const test = base.extend<{
  context: BrowserContext;
  popup: Page;
}>({
  // https://playwright.dev/docs/chrome-extensions
  context: async ({}, use) => {
    const pathToExtension = path.resolve(process.cwd(), "./dist");
    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: [
        process.env.PWDEBUG ? "" : "--headless=new",
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
  },
  popup: async ({ page }, use) => {
    await page.goto(
      `chrome-extension://fncgajbgcdgennojcoeoadgekedmkfoc/src/popup/index.html`
    );
    await use(page);
  },
});
export const expect = test.expect;
