<script setup lang="ts">
import { Editor } from "@bytemd/vue-next";
import gfm from "@bytemd/plugin-gfm";
import { pluginSlug, vim } from "../plugins";
import { getProcessor, type BytemdEditorContext } from "bytemd";
import { watch, onMounted, ref } from "vue";
import math from "@bytemd/plugin-math";
import breaks from "@bytemd/plugin-breaks";
import { useBytemdStyles } from "@/composables/use-styles";
import type { AttachmentLike } from "@halo-dev/console-shared";
import { consoleApiClient } from "@halo-dev/api-client";

useBytemdStyles();

const plugins = ref([
  gfm(),
  pluginSlug(),
  math(),
  breaks(),
  {
    actions: [
      {
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><g fill="none"><path fill="currentColor" d="M44 24a2 2 0 1 0-4 0h4ZM24 8a2 2 0 1 0 0-4v4Zm15 32H9v4h30v-4ZM8 39V9H4v30h4Zm32-15v15h4V24h-4ZM9 8h15V4H9v4Zm0 32a1 1 0 0 1-1-1H4a5 5 0 0 0 5 5v-4Zm30 4a5 5 0 0 0 5-5h-4a1 1 0 0 1-1 1v4ZM8 9a1 1 0 0 1 1-1V4a5 5 0 0 0-5 5h4Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="m6 35l10.693-9.802a2 2 0 0 1 2.653-.044L32 36m-4-5l4.773-4.773a2 2 0 0 1 2.615-.186L42 31M30 12h12m-6-6v12"/></g></svg>',
        title: "Attachment",
        handler: {
          type: "action",
          click: (context: BytemdEditorContext): void => {
            editorContext.value = context;
            attachmentSelectorModal.value = true;
          },
        },
      },
    ],
  },
]);

const VIM_KEYMAP_NAME = "vim";

const props = defineProps({
  raw: {
    type: String,
    required: false,
    default: "",
  },
  content: {
    type: String,
    required: false,
    default: "",
  },
});

const emit = defineEmits<{
  (event: "update:raw", value: string): void;
  (event: "update:content", value: string): void;
  (event: "update", value: string): void;
}>();

const handleChange = (v: string) => {
  emit("update:raw", v);

  if (v !== props.raw) {
    emit("update", v);
  }
};

onMounted(async () => {
  try {
    const { data } = await consoleApiClient.plugin.plugin.fetchPluginJsonConfig(
      {
        name: "PluginBytemd",
      }
    );

    const configMapData = data as Record<string, any>;

    if (configMapData?.basic?.keymap === VIM_KEYMAP_NAME) {
      plugins.value = [...plugins.value, vim()];
    }
  } catch (e) {
    // ignore this
  }
});

watch(
  () => props.raw,
  (value) => {
    const processor = getProcessor({ plugins: plugins.value }).processSync(
      value
    );
    emit("update:content", processor.toString());
  },
  {
    immediate: true,
  }
);

// attachment selector
const attachmentSelectorModal = ref(false);
const editorContext = ref<BytemdEditorContext>();
const onAttachmentSelect = (attachments: AttachmentLike[]) => {
  if (!attachments.length) {
    return;
  }

  attachments.forEach((attachment) => {
    if (typeof attachment === "string") {
      editorContext.value?.appendBlock(`![](${attachment})`);
    } else if ("url" in attachment) {
      editorContext.value?.appendBlock(
        `![${attachment.type}](${attachment.url})`
      );
    } else if ("spec" in attachment) {
      const { mediaType, displayName } = attachment.spec;
      const { permalink } = attachment.status || {};

      if (mediaType?.startsWith("image/")) {
        editorContext.value?.appendBlock(`![${displayName}](${permalink})`);
        return;
      }

      if (mediaType?.startsWith("video/")) {
        editorContext.value?.appendBlock(`<video src="${permalink}"></video>`);
        return;
      }

      if (mediaType?.startsWith("audio/")) {
        editorContext.value?.appendBlock(`<audio src="${permalink}"></audio>`);
        return;
      }

      editorContext.value?.appendBlock(`[${displayName}](${permalink})`);
    }
  });

  attachmentSelectorModal.value = false;
  editorContext.value = undefined;
};
</script>

<template>
  <section class="bytemd-wrapper">
    <Editor :value="raw" :plugins="plugins" @change="handleChange" />
    <AttachmentSelectorModal
      v-model:visible="attachmentSelectorModal"
      @select="onAttachmentSelect"
    />
  </section>
</template>
