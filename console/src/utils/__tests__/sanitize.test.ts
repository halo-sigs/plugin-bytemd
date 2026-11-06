import { describe, expect, it } from "vitest";
import { getProcessor } from "bytemd";
import gfm from "@bytemd/plugin-gfm";
import math from "@bytemd/plugin-math";
import breaks from "@bytemd/plugin-breaks";
import { allowInlineStyles } from "../sanitize";

const render = (markdown: string, enabled = false) =>
  getProcessor({
    plugins: [gfm(), math(), breaks()],
    sanitize: enabled ? allowInlineStyles : undefined,
  })
    .processSync(markdown)
    .toString();

const layout = `<div style="display:flex;gap:12px;background:#eef;padding:16px"><span style="color:red">Prefill</span><strong>KV Cache → Decode</strong></div>`;

describe("optional inline styles", () => {
  it("keeps ByteMD's default filtering when disabled", () => {
    expect(render(layout)).not.toContain("style=");
    expect(render(layout)).toContain("<span>Prefill</span>");
  });

  it("preserves nested inline layout, colors and spacing when enabled", () => {
    expect(render(layout, true)).toContain(
      'style="display:flex;gap:12px;background:#eef;padding:16px"'
    );
    expect(render(layout, true)).toContain('style="color:red"');
  });

  it.each([false, true])(
    "filters scripts, handlers and unsafe protocols (enabled=%s)",
    (enabled) => {
      const html = render(
        `<script>alert(1)</script><style>body{display:none}</style><iframe src="https://example.com"></iframe><p onclick="alert(1)" style="color:red">text</p><img src="x" onerror="alert(1)"><a href="javascript:alert(1)">link</a>`,
        enabled
      );
      expect(html).not.toMatch(
        /<script|<style|<iframe|onclick|onerror|javascript:/
      );
      expect(html).toContain("text");
    }
  );

  it("does not modify the supplied schema or leak opt-in to later renders", () => {
    const schema = { attributes: { "*": ["className"] }, tagNames: ["p"] };
    const original = structuredClone(schema);
    allowInlineStyles(schema);
    expect(schema).toEqual(original);
    render(layout, true);
    expect(render(layout)).not.toContain("style=");
  });

  it("preserves Markdown, tables, code, links, line breaks and math", () => {
    const markdown =
      '# Heading\n\n**bold** and [link](https://example.com)\nnext line\n\n| a | b |\n| - | - |\n| 1 | 2 |\n\n```html\n<p style="color:red">code</p>\n```\n\n$x^2$';
    const html = render(markdown);
    expect(render(markdown, true)).toBe(html);
    expect(html).toContain("<table>");
    expect(html).toContain("&#x3C;p style=");
    expect(html).toContain('class="math math-inline"');
    expect(html).toContain("<br>");
  });
});
