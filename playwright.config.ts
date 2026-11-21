import { defineConfig, devices } from "@playwright/test";

// 本机无法稳定下载 Playwright Chromium 时退回到系统 Edge；CI 使用自带 Chromium。
const channel =
  process.env.PLAYWRIGHT_CHANNEL ??
  (process.platform === "win32" && !process.env.CI ? "msedge" : undefined);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://127.0.0.1:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev:renderer",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        channel,
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
});
