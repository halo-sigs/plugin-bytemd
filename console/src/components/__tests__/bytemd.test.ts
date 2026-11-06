import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getProcessor } from "bytemd";
import { defineComponent, h } from "vue";
import Bytemd from "../bytemd.vue";

const { fetchConfig, renderMermaid } = vi.hoisted(() => ({
  fetchConfig: vi.fn(),
  renderMermaid: vi.fn(async (html: string) => html),
}));
vi.mock("@halo-dev/api-client", () => ({
  consoleApiClient: {
    plugin: { plugin: { fetchPluginJsonConfig: fetchConfig } },
  },
  ucApiClient: {},
}));
vi.mock("../../plugins", () => ({
  markdownTable: () => ({}),
  mermaidPlugin: () => ({}),
  pluginSlug: () => ({}),
  vim: () => ({}),
  renderMermaidInHtml: renderMermaid,
}));
// Render through the same ByteMD API as its Viewer to compare preview and save.
vi.mock("@bytemd/vue-next", () => ({
  Editor: defineComponent({
    props: ["value", "plugins", "sanitize"],
    setup: (props) => () =>
      h("div", {
        class: "preview",
        innerHTML: getProcessor(props).processSync(props.value).toString(),
      }),
  }),
}));
const raw = '<div style="display:flex;color:red">Prefill → Decode</div>';
const wrappers: ReturnType<typeof mount>[] = [];
const create = () => {
  const wrapper = mount(Bytemd, { props: { raw } });
  wrappers.push(wrapper);
  return wrapper;
};
afterEach(() => {
  wrappers.forEach((wrapper) => wrapper.unmount());
  wrappers.length = 0;
  vi.clearAllMocks();
});

describe("ByteMD configuration and saved HTML", () => {
  it("waits for delayed settings, then uses identical rules for preview and save", async () => {
    let resolve!: (value: unknown) => void;
    fetchConfig.mockReturnValueOnce(
      new Promise((done) => {
        resolve = done;
      })
    );
    const wrapper = create();
    expect(wrapper.emitted("update:content")).toBeUndefined();
    expect(wrapper.find(".preview").exists()).toBe(false);
    resolve({ data: { basic: { allowInlineStyles: true, keymap: "vim" } } });
    await flushPromises();
    const content = wrapper.emitted("update:content")?.at(-1)?.[0] as string;
    expect(content).toContain('style="display:flex;color:red"');
    expect(wrapper.find(".preview").element.innerHTML).toBe(content);
    await wrapper.setProps({ raw: '<span style="color:blue">edited</span>' });
    await flushPromises();
    expect(wrapper.emitted("update:content")?.at(-1)?.[0]).toBe(
      '<p><span style="color:blue">edited</span></p>'
    );
  });

  it.each([undefined, false, "true"])(
    "uses the default policy for missing/disabled/invalid settings (%s)",
    async (setting) => {
      fetchConfig.mockResolvedValueOnce({
        data: { basic: { allowInlineStyles: setting } },
      });
      const wrapper = create();
      await flushPromises();
      const content = wrapper.emitted("update:content")?.at(-1)?.[0] as string;
      expect(content).not.toContain("style=");
      expect(wrapper.find(".preview").element.innerHTML).toBe(content);
    }
  );

  it("falls back to the default policy if loading settings fails", async () => {
    fetchConfig.mockRejectedValueOnce(new Error("unavailable"));
    const wrapper = create();
    await flushPromises();
    expect(wrapper.emitted("update:content")?.at(-1)?.[0]).not.toContain(
      "style="
    );
    expect(wrapper.find(".preview").exists()).toBe(true);
  });

  it("does not emit a stale asynchronous Mermaid render after newer input", async () => {
    fetchConfig.mockResolvedValueOnce({
      data: { basic: { allowInlineStyles: true } },
    });
    let resolve!: (value: string) => void;
    renderMermaid.mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done;
        })
    );
    const wrapper = create();
    await flushPromises();
    await wrapper.setProps({ raw: "latest" });
    await flushPromises();
    resolve("stale");
    await flushPromises();
    expect(wrapper.emitted("update:content")).toEqual([["<p>latest</p>"]]);
  });
});
