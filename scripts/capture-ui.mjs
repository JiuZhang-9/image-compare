import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const baseUrl = process.env.UI_KIT_URL ?? "http://127.0.0.1:5173/ui-kit.html";
const outputDirectory = path.resolve("artifacts/ui");

fs.mkdirSync(outputDirectory, { recursive: true });

async function launchBrowser() {
  try {
    return await chromium.launch();
  } catch {
    return chromium.launch({ channel: "msedge" });
  }
}

const browser = await launchBrowser();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});

await page.goto(baseUrl, { waitUntil: "networkidle" });

async function capture(name) {
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(outputDirectory, `${name}.png`) });
  console.log(`captured ${name}`);
}

await capture("prototype-dark-compare");

await page.getByRole("button", { name: "关于" }).click();
await capture("prototype-dark-about");
await page.getByRole("button", { name: "知道了" }).click();

await page.getByRole("button", { name: "单图" }).click();
await capture("prototype-dark-single");

await page.getByRole("button", { name: "多图" }).click();
await capture("prototype-dark-grid");

await page.getByRole("button", { name: "对比" }).click();
await page.getByRole("button", { name: "浅色", exact: true }).click();
await capture("prototype-light-compare");

await page.getByRole("button", { name: "单图" }).click();
await capture("prototype-light-single");

await page.getByRole("button", { name: "多图" }).click();
await capture("prototype-light-grid");

await page.getByRole("button", { name: "组件库" }).click();
await capture("components-light");

await page.getByRole("button", { name: "深色", exact: true }).click();
await capture("components-dark");

await browser.close();
console.log(`screenshots saved to ${outputDirectory}`);
