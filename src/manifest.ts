import pkg from "../package.json";

export function getManifest(): chrome.runtime.ManifestV3 {
  return {
    manifest_version: 3,
    author: pkg.author,
    description: pkg.description,
    name: pkg.name,
    version: pkg.version,
    content_scripts: [
      {
        js: ["src/content-script/content-script.ts"],
        // TODO: scope this more to just PR/diff views?
        // Or have the content script no-op when not needed
        matches: ["*://*.github.com/*"],
      },
    ],
    icons: {
      48: "icons/48.png",
    },
    action: {
      default_icon: {
        48: "icons/48.png",
      },
      default_popup: "src/popup/index.html",
    },
    host_permissions: ["*://*/*"],
    permissions: ["storage"],
    browser_specific_settings: {
      gecko: {
        id: "gh-file-sort@example.com",
      },
    },
  };
}
