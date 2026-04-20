import { rsbuildConfig } from "@halo-dev/ui-plugin-bundler-kit";
import { pluginSass } from "@rsbuild/plugin-sass";

export default rsbuildConfig({
  rsbuild: {
    plugins: [pluginSass()],
  },
});
