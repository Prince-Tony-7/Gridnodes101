/**
 * Dependency-free JSON tokenizer for syntax highlighting.
 *
 * Produces a flat token list that React renders as <span>s, so no HTML string
 * injection (and therefore no XSS surface) is involved.
 */

export type JsonTokenType = "key" | "string" | "number" | "literal" | "punct" | "plain";

export interface JsonToken {
  type: JsonTokenType;
  value: string;
}

const TOKEN_RE =
  /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|([{}[\],:])/g;

export function tokenizeJson(source: string): JsonToken[] {
  const tokens: JsonToken[] = [];
  let lastIndex = 0;

  for (const match of source.matchAll(TOKEN_RE)) {
    const index = match.index ?? 0;
    if (index > lastIndex) tokens.push({ type: "plain", value: source.slice(lastIndex, index) });

    const [full, str, colon, literal, num, punct] = match;
    if (str !== undefined) {
      tokens.push({ type: colon ? "key" : "string", value: str });
      if (colon) tokens.push({ type: "punct", value: colon });
    } else if (literal !== undefined) {
      tokens.push({ type: "literal", value: literal });
    } else if (num !== undefined) {
      tokens.push({ type: "number", value: num });
    } else if (punct !== undefined) {
      tokens.push({ type: "punct", value: punct });
    } else {
      tokens.push({ type: "plain", value: full });
    }
    lastIndex = index + full.length;
  }

  if (lastIndex < source.length) tokens.push({ type: "plain", value: source.slice(lastIndex) });
  return tokens;
}
