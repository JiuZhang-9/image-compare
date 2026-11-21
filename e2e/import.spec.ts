import { expect, test } from "@playwright/test";
import { fileURLToPath } from "node:url";

const fixture = (name: string) =>
  fileURLToPath(new URL(`./fixtures/${name}`, import.meta.url));

test("imports images through the file picker", async ({ page }) => {
  await page.goto("/");

  await page
    .locator('input[type="file"]')
    .setInputFiles([fixture("red.png"), fixture("blue.png")]);

  await expect(page.getByRole("button", { name: "选择图片: red.png" })).toBeVisible();
  await expect(page.getByRole("button", { name: "选择图片: blue.png" })).toBeVisible();
});
