/** Prefixes a /public path with the deploy base path (e.g. "/Gridnodes101") for raw <video>/<img> tags. */
export function withBasePath(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path.startsWith("/") ? path : `/${path}`}`;
}
