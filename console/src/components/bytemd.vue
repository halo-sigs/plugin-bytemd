<script setup lang="ts">
import "bytemd/dist/index.css";
import "github-markdown-css/github-markdown-light.css";
import { Editor } from "@bytemd/vue-next";
import gfm from "@bytemd/plugin-gfm";
import { pluginSlug, vim } from "../plugins";
import { getProcessor } from "bytemd";
import { watch, onMounted, ref } from "vue";

const plugins = ref([gfm(), pluginSlug()]);

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

const fetchConfigMap = async (url: string): Promise<ConfigMap> => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

onMounted(async () => {
  try {
    const configMap = await fetchConfigMap(
      "/api/v1alpha1/configmaps/configmap-plugin-bytemd"
    );
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
<style lang="scss">
.bytemd {
  height: 100%;
  border: none;

  &.bytemd-fullscreen {
    z-index: 9999;
  }

  .markdown-body {
    ul {
      list-style: disc;
    }

    ol {
      list-style: decimal;
    }
  }
}
</style>
