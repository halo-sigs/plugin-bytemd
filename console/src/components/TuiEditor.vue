<script setup lang="ts">
import "bytemd/dist/index.css";
import "github-markdown-css/github-markdown-light.css";
import { Editor } from "@bytemd/vue-next";
import gfm from "@bytemd/plugin-gfm";

const plugins = [gfm()];

defineProps({
  modelValue: {
    type: String,
    required: false,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const handleChange = (v: string) => {
  emit("update:modelValue", v);
};
</script>

<template>
  <Editor :value="modelValue" :plugins="plugins" @change="handleChange" />
</template>
<style>
.bytemd {
  height: 100%;
}
.bytemd.bytemd-fullscreen {
  z-index: 9999;
}
</style>
