import { definePlugin } from "@halo-dev/console-shared";
import "@toast-ui/editor/dist/toastui-editor.css";
import { markRaw } from "vue";
import TuiEditor from "./components/TuiEditor.vue";

export default definePlugin({
  extensionPoints: {
    "editor:create": () => {
      return [
        {
          name: "tui.editor",
          component: markRaw(TuiEditor),
          rawType: "markdown",
        },
      ];
    },
  },
});
