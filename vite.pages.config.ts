import path from "node:path";
import {fileURLToPath} from "node:url";
import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const base = process.env.PAGES_BASE_PATH || "/pdf-editor/namecard-maker/";
if (!base.startsWith("/") || !base.endsWith("/")) {
  throw new Error("PAGES_BASE_PATH must start and end with a slash.");
}

export default defineConfig({
  root: path.join(projectRoot, "pages"),
  base,
  publicDir: path.join(projectRoot, "public"),
  plugins: [react()],
  resolve: {alias: {"@": projectRoot}, dedupe: ["react", "react-dom"]},
  build: {outDir: path.join(projectRoot, "dist-pages"), emptyOutDir: true},
});
