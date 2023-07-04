import pkg from "../package.json";

export function getManifest(): chrome.runtime.ManifestV3 {
  return {
    manifest_version: 3,
    author: pkg.author,
    description: pkg.description,
    name: "Github Diff Order",
    version: pkg.version,
    // Dummy key so that we get a stable extension ID for playwright tests.
    // TODO: Use a real ID if this ever publishes to Chrome Web Store
    // https://stackoverflow.com/questions/23873623/obtaining-chrome-extension-id-for-development
    //
    // extensionId for this key: fncgajbgcdgennojcoeoadgekedmkfoc
    key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmtdV/ts5+pcOAM3AP9csVIukGgFBWDLJZQrT4txjNSlqkwzEgQXY28JMyWNm6oa4uHL/eTECy2nDGjWApT2SbrwggD+R+g/a9MvkGlRp5dayUX3B0VHYIqSN1nr/7ErUX0ohaRR46KAd0PN1NK1tYXDnGRRhKNPo+BOH/YP0iRdVOAyUBXUcoWrFXT5vQlBFeuDTfwjE0vhozslxQUDtRpcRJ8QLXKhk7H5fxHVXdDtBN0i89ftPemAOFHB6iNpARJzGfq4+cUaCgbY/CLNrIGbppRZ9c4yf3ziFzpIy1zyIJTkR1Wfh6hl6pv5/YI+CPgRJAybwwGxuBT/ApcT51wIDAQAB",
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
