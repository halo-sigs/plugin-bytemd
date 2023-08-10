import { useStyleTag } from "@vueuse/core";
import bytemdStyles from "bytemd/dist/index.css?raw";
import markdownStyles from "github-markdown-css/github-markdown-light.css?raw";
import { onMounted, onUnmounted } from "vue";

export function useBytemdStyles() {
  // inject styles to resolve stylesheet conflicts
  const { load, unload } = useStyleTag(
    [
      bytemdStyles,
      markdownStyles,
      `
.bytemd-wrapper > div {
  height: 100%;
}
.bytemd {
  height: 100%;
  border: none;
}
.bytemd.bytemd-fullscreen {
  z-index: 9999;
}
.bytemd .markdown-body ul {
  list-style: disc;
}
.bytemd .markdown-body ol {
  list-style: decimal;
}
`,
    ].join("\n"),
    {
      id: "plugin-bytemd",
    }
  );
  onMounted(() => {
    load();
  });

  onUnmounted(() => {
    unload();
  });
}
