<script setup lang="ts">
import "bytemd/dist/index.css";
import "github-markdown-css/github-markdown-light.css";
import { Editor } from "@bytemd/vue-next";
import gfm from "@bytemd/plugin-gfm";
import { getProcessor } from "bytemd";

const plugins = [gfm()];

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

const emit = defineEmits(["update:raw", "update:content"]);

const handleChange = (v: string) => {
  emit("update:raw", v);

  const processor = getProcessor({ plugins: plugins }).processSync(props.raw);

  emit("update:content", processor.toString());
};
</script>

<template>
  <Editor :value="raw" :plugins="plugins" @change="handleChange" />
</template>
<style>
.bytemd {
  height: 100%;
  border: none;
}
.bytemd.bytemd-fullscreen {
  z-index: 9999;
}
</style>
