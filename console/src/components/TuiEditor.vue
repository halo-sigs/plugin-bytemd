<script setup lang="ts">
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    required: false,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);
const editor = ref();

const editorInstance = ref<Editor>();

onMounted(() => {
  createEditor();
});

const createEditor = () => {
  if (editorInstance.value) {
    editorInstance.value.destroy();
  }
  editorInstance.value = new Editor({
    initialValue: props.modelValue,
    el: editor.value,
    height: "100%",
    initialEditType: "markdown",
    previewStyle: "vertical",
    events: {
      change: () =>
        emit("update:modelValue", editorInstance.value?.getMarkdown()),
    },
  });
};

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue !== editorInstance.value?.getMarkdown()) {
      createEditor();
    }
  }
);
</script>

<template>
  <div ref="editor" />
</template>
