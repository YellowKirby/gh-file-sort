import type { StorybookConfig } from "@storybook/svelte-vite";
const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx|svelte)"],
  addons: [
    {
      name: "@storybook/addon-essentials",
      options: {
        controls: false,
      },
    },
  ],
  framework: {
    name: "@storybook/svelte-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  viteFinal(config) {
    return {
      ...config,
      // vite-plugin-web-extension throws when used in Storybook
      // TODO debug this more
      plugins: config.plugins?.filter((plugin) => {
        const isWebExtPlugin =
          plugin && "name" in plugin && plugin.name === "webExtension";
        return !isWebExtPlugin;
      }),
    };
  },
};
export default config;
