import type { BytemdPlugin, BytemdEditorContext } from "bytemd";
import rehypeSlug from "rehype-slug";
import rehypeMermaid from "rehype-mermaid";
import useVim from "codemirror-ssr/keymap/vim";

export function pluginSlug(): BytemdPlugin {
  return {
    rehype: (processor) => processor.use(rehypeSlug),
  };
}

export function pluginMermaidSSR(): BytemdPlugin {
  return {
    rehype: (processor) =>
      processor.use(rehypeMermaid, {
        strategy: "inline-svg",
      }),
  };
}

export function vim(): BytemdPlugin {
  return {
    editorEffect(ctx: BytemdEditorContext) {
      useVim(ctx.codemirror);
      ctx.editor.setOption("keyMap", "vim");
    },
  };
}
