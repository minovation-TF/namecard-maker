import {spawnSync} from "node:child_process";
import {existsSync, readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
function run(command, args) {
  const result = spawnSync(command, args, {cwd: root, stdio: "inherit"});
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}

const catalog = JSON.parse(readFileSync(new URL("../lib/generated/meritz-catalog.json", import.meta.url), "utf8"));
const requiredAssets = ["/assets/lab-sans.woff2", "/assets/catalog-common/meritz-en.png", ...catalog.flatMap(asset => [asset.src, asset.thumbnail]).filter(Boolean)];
if (requiredAssets.some(asset => !existsSync(new URL("../public" + asset, import.meta.url)))) {
  run(process.env.PAGES_PYTHON || (process.platform === "win32" ? "python" : "python3"), ["scripts/restore-assets.py"]);
}
run(process.execPath, ["node_modules/vite/bin/vite.js", "build", "--config", "vite.pages.config.ts"]);
