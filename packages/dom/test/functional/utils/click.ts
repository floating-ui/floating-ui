/**
 * Prevents scrolling into view upon click
 */
export async function click(page: any, selector: string) {
  await page.waitForSelector(selector);
  return await page.evaluate((selector: string) => {
    (document.querySelector(selector) as HTMLButtonElement).click();
  }, selector);
}
