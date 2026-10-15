/** Prefix browser assets only when the standalone Pages entry declares a base. */
export function assetPath(value: string): string {
  if (!value.startsWith("/assets/")) return value;
  const base = typeof document === "undefined"
    ? ""
    : (document.documentElement.dataset.assetBase || "").replace(/\/$/, "");
  return base + value;
}
