import type { ViewerProps } from "bytemd";

// Only extend the attribute allowlist. Keep ByteMD's tag, protocol and event
// handler filtering intact. Inline CSS itself is trusted when this is enabled.
export const allowInlineStyles: NonNullable<ViewerProps["sanitize"]> = (
  schema
) => ({
  ...schema,
  attributes: {
    ...schema.attributes,
    "*": [...(schema.attributes?.["*"] || []), "style"],
  },
});
