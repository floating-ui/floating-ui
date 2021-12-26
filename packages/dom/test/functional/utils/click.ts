/**
 * Prevents scrolling into view upon click
 */
export async function click(page: any, selector: string) {
  return await page.evaluate((selector: string) => {
    (document.querySelector(selector) as HTMLButtonElement).click();
  }, selector);
}
