import pkg from "../package.json";

const sharedManifest = {
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
  permissions: [],
};

const browserAction = {
  default_icon: {
    48: "icons/48.png",
  },
  default_popup: "src/popup/index.html",
};

const ManifestV2 = {
  ...sharedManifest,
  browser_action: browserAction,
  permissions: [...sharedManifest.permissions, "storage", "*://*/*"],
  browser_specific_settings: {
    gecko: {
      id: "gh-file-sort@example.com",
    },
  },
};

const ManifestV3 = {
  ...sharedManifest,
  action: browserAction,
  host_permissions: ["*://*/*"],
};

export function getManifest(
  manifestVersion: number
): chrome.runtime.ManifestV2 | chrome.runtime.ManifestV3 {
  const manifest = {
    author: pkg.author,
    description: pkg.description,
    name: pkg.name,
    version: pkg.version,
  };

  if (manifestVersion === 2) {
    return {
      ...manifest,
      ...ManifestV2,
      manifest_version: manifestVersion,
    };
  }

  if (manifestVersion === 3) {
    return {
      ...manifest,
      ...ManifestV3,
      manifest_version: manifestVersion,
    };
  }

  throw new Error(
    `Missing manifest definition for manifestVersion ${manifestVersion}`
  );
}
