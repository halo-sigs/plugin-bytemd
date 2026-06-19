import type { ViewerProps } from "bytemd";

type Sanitize = NonNullable<ViewerProps["sanitize"]>;
type Schema = Parameters<Sanitize>[0];
type SchemaAttribute = NonNullable<Schema["attributes"]>[string][number];

const CUSTOM_ELEMENT_TAG_PATTERN =
  /<([a-z](?:[a-z0-9._-]*-[a-z0-9._-]*))(?=[\s/>])((?:[^"'<>]|"[^"]*"|'[^']*')*)\/?>/gi;
const ATTRIBUTE_PATTERN =
  /([:@a-zA-Z_][:@a-zA-Z0-9_.-]*)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?/g;
const BLOCKED_ATTRIBUTES = new Set(["style", "srcdoc"]);
const BLOCKED_ATTRIBUTE_PREFIXES = ["on"];

type CustomElementDefinition = {
  tagName: string;
  attributes: string[];
};

function isBlockedAttribute(attributeName: string) {
  const normalized = attributeName.toLowerCase();

  return (
    BLOCKED_ATTRIBUTES.has(normalized) ||
    BLOCKED_ATTRIBUTE_PREFIXES.some((prefix) => normalized.startsWith(prefix))
  );
}

function toCamelCase(attributeName: string) {
  return attributeName.replace(/-([a-z0-9])/g, (_, char: string) =>
    char.toUpperCase()
  );
}

function normalizeAttributeNames(attributeName: string) {
  const normalized = attributeName.toLowerCase();

  if (normalized.startsWith("data-")) {
    return ["data*"];
  }

  const candidates = new Set([normalized, toCamelCase(normalized)]);
  return [...candidates];
}

function extractCustomElements(markdown: string): CustomElementDefinition[] {
  const customElements = new Map<string, Set<string>>();

  for (const match of markdown.matchAll(CUSTOM_ELEMENT_TAG_PATTERN)) {
    const [, rawTagName, rawAttributes = ""] = match;
    const tagName = rawTagName.toLowerCase();
    const attributes = customElements.get(tagName) ?? new Set<string>();

    for (const attributeMatch of rawAttributes.matchAll(ATTRIBUTE_PATTERN)) {
      const rawAttributeName = attributeMatch[1];

      if (isBlockedAttribute(rawAttributeName)) {
        continue;
      }

      normalizeAttributeNames(rawAttributeName).forEach((attributeName) => {
        attributes.add(attributeName);
      });
    }

    customElements.set(tagName, attributes);
  }

  return [...customElements.entries()].map(([tagName, attributes]) => ({
    tagName,
    attributes: [...attributes],
  }));
}

function hasAttribute(
  schemaAttributes: SchemaAttribute[],
  attributeName: string
): boolean {
  return schemaAttributes.some((attribute) => {
    if (Array.isArray(attribute)) {
      return attribute[0] === attributeName;
    }

    return attribute === attributeName;
  });
}

export function createCustomHtmlSanitize(
  getMarkdown: () => string
): Sanitize {
  return (schema) => {
    const customElements = extractCustomElements(getMarkdown());

    if (!customElements.length) {
      return schema;
    }

    const tagNames = [...(schema.tagNames ?? [])];
    const attributes = Object.fromEntries(
      Object.entries(schema.attributes ?? {}).map(([tagName, tagAttributes]) => [
        tagName,
        [...tagAttributes],
      ])
    );

    customElements.forEach(({ tagName, attributes: tagAttributes }) => {
      if (!tagNames.includes(tagName)) {
        tagNames.push(tagName);
      }

      const allowedAttributes = attributes[tagName] ?? [];

      tagAttributes.forEach((attributeName) => {
        if (!hasAttribute(allowedAttributes, attributeName)) {
          allowedAttributes.push(attributeName);
        }
      });

      attributes[tagName] = allowedAttributes;
    });

    return {
      ...schema,
      tagNames,
      attributes,
    };
  };
}
