import { definePlugin } from "@halo-dev/console-shared";
import { defineAsyncComponent } from "vue";
import { VLoading } from "@halo-dev/components";

export default definePlugin({
  extensionPoints: {
    "editor:create": () => {
      return [
        {
          name: "bytemd",
          displayName: "ByteMD",
          component: defineAsyncComponent({
            loader: () => import("./components/bytemd.vue"),
            loadingComponent: VLoading,
          }),
          rawType: "markdown",
          logo: "/plugins/PluginBytemd/assets/logo.png",
        },
      ];
    },
  },
});
