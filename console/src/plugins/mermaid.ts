import type { BytemdPlugin } from "bytemd";

const MERMAID_SELECTOR = "pre > code.language-mermaid";
const MERMAID_THEME_FALLBACKS = {
  background: "white",
  primaryColor: "#ECECFF",
  primaryTextColor: "#131300",
  primaryBorderColor: "hsl(240, 60%, 86.2745098039%)",
  secondaryColor: "#ffffde",
  secondaryTextColor: "#000021",
  secondaryBorderColor: "hsl(60, 60%, 83.5294117647%)",
  tertiaryColor: "hsl(80, 100%, 96.2745098039%)",
  tertiaryTextColor: "rgb(6.3333333334, 0, 19.0000000001)",
  tertiaryBorderColor: "hsl(80, 60%, 86.2745098039%)",
  noteBkgColor: "#fff5ad",
  noteTextColor: "black",
  noteBorderColor: "#aaaa33",
  lineColor: "#333333",
  textColor: "#333",
  mainBkg: "#ECECFF",
  errorBkgColor: "#552222",
  errorTextColor: "#552222",
  nodeBorder: "#9370DB",
  clusterBkg: "#ffffde",
  clusterBorder: "#aaaa33",
  defaultLinkColor: "#333333",
  titleColor: "#333",
  edgeLabelBackground: "#e8e8e8",
  actorBkg: "#ECECFF",
  actorBorder: "hsl(259.6261682243, 59.7765363128%, 87.9019607843%)",
  actorTextColor: "black",
  actorLineColor: "grey",
  signalColor: "#333",
  signalTextColor: "#333",
  labelBoxBkgColor: "#ECECFF",
  labelBoxBorderColor: "hsl(259.6261682243, 59.7765363128%, 87.9019607843%)",
  labelTextColor: "black",
  loopTextColor: "black",
  activationBorderColor: "#666",
  activationBkgColor: "#f4f4f4",
  sequenceNumberColor: "white",
  altBackground: "#f0f0f0",
  classText: "#131300",
  cScale0: "hsl(240, 100%, 76.2745098039%)",
  cScale1: "hsl(60, 100%, 73.5294117647%)",
  cScale2: "hsl(80, 100%, 76.2745098039%)",
  cScale3: "hsl(270, 100%, 76.2745098039%)",
  cScale4: "hsl(300, 100%, 76.2745098039%)",
  cScale5: "hsl(330, 100%, 76.2745098039%)",
  cScale6: "hsl(0, 100%, 76.2745098039%)",
  cScale7: "hsl(30, 100%, 76.2745098039%)",
  cScale8: "hsl(90, 100%, 76.2745098039%)",
  cScale9: "hsl(150, 100%, 76.2745098039%)",
  cScale10: "hsl(180, 100%, 76.2745098039%)",
  cScale11: "hsl(210, 100%, 76.2745098039%)",
  cScaleInv0: "hsl(60, 100%, 86.2745098039%)",
  cScaleInv1: "hsl(240, 100%, 83.5294117647%)",
  cScaleInv2: "hsl(260, 100%, 86.2745098039%)",
  cScaleInv3: "hsl(90, 100%, 86.2745098039%)",
  cScaleInv4: "hsl(120, 100%, 86.2745098039%)",
  cScaleInv5: "hsl(150, 100%, 86.2745098039%)",
  cScaleInv6: "hsl(180, 100%, 86.2745098039%)",
  cScaleInv7: "hsl(210, 100%, 86.2745098039%)",
  cScaleInv8: "hsl(270, 100%, 86.2745098039%)",
  cScaleInv9: "hsl(330, 100%, 86.2745098039%)",
  cScaleInv10: "hsl(0, 100%, 86.2745098039%)",
  cScaleInv11: "hsl(30, 100%, 86.2745098039%)",
  cScaleLabel0: "#ffffff",
  cScaleLabel1: "black",
  cScaleLabel2: "black",
  cScaleLabel3: "#ffffff",
  cScaleLabel4: "black",
  cScaleLabel5: "black",
  cScaleLabel6: "black",
  cScaleLabel7: "black",
  cScaleLabel8: "black",
  cScaleLabel9: "black",
  cScaleLabel10: "black",
  cScaleLabel11: "black",
};
const MERMAID_THEME_VARIABLES = {
  ...MERMAID_THEME_FALLBACKS,
};
const MERMAID_THEME_COLOR_REPLACEMENTS = Object.entries(
  MERMAID_THEME_FALLBACKS
).map(([key, color]) => {
  return [color, `var(--bytemd-mermaid-${toKebabCase(key)}, ${color})`] as [
    string,
    string
  ];
});

let renderId = 0;
let initialized = false;
let mermaidPromise: Promise<typeof import("mermaid").default> | undefined;

async function getMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then((module) => module.default);
  }

  return mermaidPromise;
}

async function initializeMermaid() {
  const mermaid = await getMermaid();

  if (initialized) {
    return mermaid;
  }

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: "base",
    themeVariables: MERMAID_THEME_VARIABLES,
  });
  initialized = true;
  return mermaid;
}

async function renderMermaidSvg(definition: string): Promise<string> {
  const mermaid = await initializeMermaid();

  const id = `bytemd-mermaid-${Date.now()}-${renderId++}`;
  const { svg } = await mermaid.render(id, definition);
  return replaceMermaidThemeColors(svg);
}

function replaceMermaidThemeColors(svg: string) {
  return MERMAID_THEME_COLOR_REPLACEMENTS.reduce(
    (result, [color, variable]) => {
      return result.replace(new RegExp(escapeRegExp(color), "gi"), variable);
    },
    svg
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toKebabCase(value: string) {
  return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

async function renderMermaidElement(
  codeElement: HTMLElement,
  shouldRender: () => boolean = () => true
) {
  const container = codeElement.closest("pre");

  if (!container) {
    return;
  }

  const definition = codeElement.textContent || "";
  const wrapper = document.createElement("div");
  wrapper.className = "bytemd-mermaid";

  try {
    wrapper.innerHTML = await renderMermaidSvg(definition);
  } catch {
    wrapper.classList.add("bytemd-mermaid-error");
    wrapper.textContent = "Mermaid render failed";
  }

  if (shouldRender()) {
    container.replaceWith(wrapper);
  }
}

export async function renderMermaidInHtml(html: string): Promise<string> {
  if (!html.includes("language-mermaid")) {
    return html;
  }

  const htmlDocument = new DOMParser().parseFromString(html, "text/html");
  const codeElements = Array.from(
    htmlDocument.body.querySelectorAll<HTMLElement>(MERMAID_SELECTOR)
  );

  await Promise.all(
    codeElements.map(async (codeElement) => {
      const container = codeElement.closest("pre");

      if (!container) {
        return;
      }

      try {
        const wrapper = htmlDocument.createElement("div");
        wrapper.className = "bytemd-mermaid";
        wrapper.innerHTML = await renderMermaidSvg(
          codeElement.textContent || ""
        );
        container.replaceWith(wrapper);
      } catch {
        // Keep the original code block when rendering fails.
      }
    })
  );

  return htmlDocument.body.innerHTML;
}

export function mermaidPlugin(): BytemdPlugin {
  return {
    viewerEffect({ markdownBody }) {
      let disposed = false;
      const codeElements = Array.from(
        markdownBody.querySelectorAll<HTMLElement>(MERMAID_SELECTOR)
      );

      codeElements.forEach((codeElement) => {
        renderMermaidElement(
          codeElement,
          () => !disposed && markdownBody.contains(codeElement)
        );
      });

      return () => {
        disposed = true;
      };
    },
  };
}
