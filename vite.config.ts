import { defineConfig } from "vite";
import svelteSVG from "vite-plugin-svelte-svg";
import webExtension from "@samrum/vite-plugin-web-extension";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { getManifest } from "./src/manifest";
import sveltePreprocess from "svelte-preprocess";

export default defineConfig(() => {
  return {
    plugins: [
      webExtension({
        manifest: getManifest(2),
      }),
      svelte({
        configFile: false,
        preprocess: [sveltePreprocess({ typescript: true })],
      }),
      svelteSVG({
        svgoConfig: {},
        requireSuffix: false,
      }),
    ],
  };
});
