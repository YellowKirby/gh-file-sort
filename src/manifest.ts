import pkg from "../package.json";

export function getManifest(): chrome.runtime.ManifestV3 {
  return {
    manifest_version: 3,
    author: pkg.author,
    description: pkg.description,
    name: "Github Diff Order",
    version: pkg.version,
    key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlkwDFPVVEFjg97W3gBz4u4NdrxtVc2mtNcEoqLCfk06JIlnp2qjfQDRGVPS1nkpCoD08GMDnWQpjWh0f6VtWmp+Cmk9dJ7C+m1sQgrl6cBjo5QfAnfbUAjdEFYQQAKftkiN/zsWITUfML35nya3ki1+HMEeKy1ZEUhcD80qhzsvrLLy3+0Dabj1m7oPQyQ7+4bjG6GIz5kxlBLvkBl6JE0W7sLUQ/y6gwyFM9mf8uWfDw1D2YiunWTPtQhlHfG4SFwsHwiltqpE7mAFJyxQvzDw2RUfMMujrFgWP0TuilyB2aT+RORmVkHKBL6OOANre/XWet+xPvWkIdbrWcpBa2QIDAQAB",
    content_scripts: [
      {
        js: ["src/content-script/content-script.ts"],
        // TODO: scope this more to just PR/diff views?
        // Or have the content script no-op when not needed
        matches: ["*://*.github.com/*"],
      },
    ],
    icons: {
      128: "icons/icon.png",
    },
    action: {
      default_icon: {
        128: "icons/icon.png",
      },
      default_popup: "src/popup/index.html",
    },
    permissions: ["storage"],
    browser_specific_settings: {
      gecko: {
        id: "{eb9647c9-cf86-4052-b65b-c30551922e7b}",
      },
    },
  };
}
