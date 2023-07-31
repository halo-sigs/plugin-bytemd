import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import VueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  const isProduction = mode === "production";
  const outDir = isProduction
    ? "../src/main/resources/console"
    : "../build/resources/main/console";

  return defineConfig({
    plugins: [Vue(), VueJsx()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    define: {
      "process.env": process.env,
    },
    build: {
      outDir,
      emptyOutDir: true,
      lib: {
        entry: "src/index.ts",
        name: "PluginBytemd",
        formats: ["iife"],
        fileName: () => "main.js",
      },
      rollupOptions: {
        external: [
          "vue",
          "vue-router",
          "@vueuse/core",
          "@vueuse/components",
          "@vueuse/router",
          "@halo-dev/shared",
          "@halo-dev/components",
        ],
        output: {
          globals: {
            vue: "Vue",
            "vue-router": "VueRouter",
            "@vueuse/core": "VueUse",
            "@vueuse/components": "VueUse",
            "@vueuse/router": "VueUse",
            "@halo-dev/console-shared": "HaloConsoleShared",
            "@halo-dev/components": "HaloComponents",
          },
          extend: true,
        },
      },
    },
  });
};
