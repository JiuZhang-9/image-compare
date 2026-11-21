import { expect, test } from "@playwright/test";
import { fileURLToPath } from "node:url";

const fixture = (name: string) =>
  fileURLToPath(new URL(`./fixtures/${name}`, import.meta.url));

test("switches between single, compare, and grid views", async ({ page }) => {
  await page.goto("/");

  await page
    .locator('input[type="file"]')
    .setInputFiles([fixture("red.png"), fixture("blue.png"), fixture("transparent.png")]);

  const compareButton = page.getByRole("button", { name: "A/B 对比", exact: true });
  const gridButton = page.getByRole("button", { name: "多图", exact: true });
  const singleButton = page.getByRole("button", { name: "单图", exact: true });

  await compareButton.click();
  await expect(compareButton).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".ab-side-view")).toBeVisible();

  await gridButton.click();
  await expect(gridButton).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".multi-compare-shell")).toBeVisible();

  await singleButton.click();
  await expect(page.locator(".single-view")).toBeVisible();
});
