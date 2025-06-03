import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import { HaloUIPluginBundlerKit } from "@halo-dev/ui-plugin-bundler-kit";

export default defineConfig({
  plugins: [Vue(), HaloUIPluginBundlerKit()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
