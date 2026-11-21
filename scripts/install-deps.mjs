import { spawnSync } from "node:child_process";

const electronMirror =
  process.env.ELECTRON_MIRROR ?? "https://npmmirror.com/mirrors/electron/";
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const result = spawnSync(npmCommand, ["ci"], {
  stdio: "inherit",
  env: { ...process.env, ELECTRON_MIRROR: electronMirror },
});

process.exit(result.status ?? 1);
