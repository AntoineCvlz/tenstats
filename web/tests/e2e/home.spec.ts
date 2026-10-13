import { expect, test } from "@playwright/test";

test("the home page shows the heading and the data attribution", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "tenstats" })).toBeVisible();
  await expect(page.getByRole("contentinfo")).toContainText("CC BY-NC-SA 4.0");
});
