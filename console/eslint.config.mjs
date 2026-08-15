import js from "@eslint/js";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import { vueTsConfigs, withVueTs } from "@vue/eslint-config-typescript";
import pluginVue from "eslint-plugin-vue";

export default withVueTs(
  {
    ignores: ["build/**"],
  },
  js.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,
  {
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },
  skipFormatting
);
