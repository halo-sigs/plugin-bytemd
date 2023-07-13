<script setup lang="ts">
import bytemdStyles from "bytemd/dist/index.css?raw";
import markdownStyles from "github-markdown-css/github-markdown-light.css?raw";
import { Editor } from "@bytemd/vue-next";
import gfm from "@bytemd/plugin-gfm";
import { pluginSlug, vim } from "../plugins";
import { getProcessor } from "bytemd";
import { watch, onMounted, ref, onUnmounted } from "vue";
import math from "@bytemd/plugin-math";
import { useStyleTag } from "@vueuse/core";

// inject styles to resolve stylesheet conflicts
const { load, unload } = useStyleTag(
  [
    bytemdStyles,
    markdownStyles,
    `
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

const plugins = ref([gfm(), pluginSlug(), math()]);

const VimKeymap = "vim";

type Metadata = {
  name: string;
  labels?: Record<string, string>;
  annotations?: Record<string, string>;
  creationTimestamp: string;
  deletionTimestamp: string;
};

type ConfigMap = {
  apiVersion: string;
  kind: string;
  metadata: Metadata;
  data?: Record<string, string>;
};

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
    const response = await fetch(
      "/api/v1alpha1/configmaps/configmap-plugin-bytemd"
    );
    const configMap: ConfigMap = await response.json();
    const { keymap } = JSON.parse(configMap.data?.basic as string);
    if (keymap === VimKeymap) {
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
</script>

<template>
  <Editor :value="raw" :plugins="plugins" @change="handleChange" />
</template>
