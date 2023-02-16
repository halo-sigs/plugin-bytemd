import type { BytemdPlugin } from "bytemd";
import rehypeSlug from "rehype-slug";

export function pluginSlug(): BytemdPlugin {
  return {
    rehype: (processor) => processor.use(rehypeSlug),
  };
}
