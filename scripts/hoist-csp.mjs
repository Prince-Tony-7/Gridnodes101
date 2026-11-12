// Post-build step: move the Content-Security-Policy <meta> to the top of <head>
// in every exported page. A CSP delivered by <meta> only applies to content
// after it, and Next.js emits its preload/script tags before page metadata.
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUT = new URL("../out/", import.meta.url).pathname;
const CSP_RE = /<meta http-equiv="Content-Security-Policy"[^>]*\/?>/;

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith(".html")) yield path;
  }
}

let moved = 0;
for await (const file of htmlFiles(OUT)) {
  const html = await readFile(file, "utf8");
  const match = html.match(CSP_RE);
  if (!match) continue;
  const without = html.replace(match[0], "");
  // Right after <meta charSet>, which must stay first.
  const charset = without.match(/<meta charSet="utf-8"\/>|<meta charset="utf-8"\/?>/i);
  const anchor = charset ? charset.index + charset[0].length : without.indexOf("<head>") + "<head>".length;
  await writeFile(file, without.slice(0, anchor) + match[0] + without.slice(anchor));
  moved += 1;
}
console.log(`hoist-csp: CSP moved to top of <head> in ${moved} page(s)`);
