import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { _electron as electron } from "playwright";

const distIndex = path.resolve("dist-renderer/index.html");
const isSupported = process.platform === "win32" && fs.existsSync(distIndex);

test.skip(!isSupported, "Requires Windows and a built dist-renderer (npm run build)");

test.setTimeout(60_000);

test("launches the Electron shell with hardened webPreferences", async () => {
  const electronApp = await electron.launch({
    args: [path.resolve(".")],
    env: { ...process.env, IMAGE_COMPARE_E2E: "1" } as Record<string, string>,
  });

  try {
    const window = await electronApp.firstWindow();
    await expect(window.locator("#root")).toBeVisible();

    const preferences = await electronApp.evaluate(({ BrowserWindow }) => {
      const [mainWindow] = BrowserWindow.getAllWindows();

      if (!mainWindow) {
        throw new Error("No BrowserWindow was created");
      }

      const webPreferences = (
        mainWindow.webContents as unknown as {
          getLastWebPreferences: () => Record<string, boolean>;
        }
      ).getLastWebPreferences();

      return {
        contextIsolation: webPreferences.contextIsolation,
        nodeIntegration: webPreferences.nodeIntegration,
        sandbox: webPreferences.sandbox,
        webSecurity: webPreferences.webSecurity,
      };
    });

    expect(preferences).toEqual({
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
    });
  } finally {
    await electronApp.close();
  }
});
