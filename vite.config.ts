import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { getContentSecurityPolicy } from "./config/contentSecurityPolicy.js";

const packageJson = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
) as { version: string };

function contentSecurityPolicyPlugin(policy: string): Plugin {
  return {
    name: "image-compare-content-security-policy",
    enforce: "pre",
    transformIndexHtml(html) {
      return html.replace("__IMAGE_COMPARE_CSP__", policy);
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: "./",
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    contentSecurityPolicyPlugin(getContentSecurityPolicy(command === "serve")),
  ],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: "dist-renderer",
    emptyOutDir: true,
  },
}));
