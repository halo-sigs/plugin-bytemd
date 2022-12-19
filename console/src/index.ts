import { definePlugin } from "@halo-dev/console-shared";
import { markRaw } from "vue";
import bytemd from "./components/bytemd.vue";

export default definePlugin({
  extensionPoints: {
    "editor:create": () => {
      return [
        {
          name: "bytemd",
          displayName: "Bytemd",
          component: markRaw(bytemd),
          rawType: "markdown",
        },
      ];
    },
  },
});
