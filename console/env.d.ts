/// <reference types="@rsbuild/core" />

declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module "@susisu/mte-kernel" {
  export const Alignment: {
    readonly NONE: string;
    readonly LEFT: string;
    readonly RIGHT: string;
    readonly CENTER: string;
  };
  export class TableEditor {
    constructor(textEditor: object);
  }
  export function options<T extends Record<string, unknown>>(options: T): T;
}
