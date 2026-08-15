import { viteConfig } from "@halo-dev/ui-plugin-bundler-kit/vite";
import path from "node:path";

export default viteConfig({
  vite: {
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
      },
    },
  },
});
