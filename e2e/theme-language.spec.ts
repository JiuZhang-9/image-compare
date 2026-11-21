import { expect, test } from "@playwright/test";

test("switches theme and language", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "选择主题" }).click();
  await page.getByRole("menuitemradio", { name: "浅色" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await page.getByRole("button", { name: "语言" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByText("Import Images", { exact: true })).toBeVisible();
});
