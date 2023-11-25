import type {Coords} from '@floating-ui/core';

/**
 * Scrolls a scroll element by an amount of pixels.
 */
export async function scroll(
  page: any,
  scrollOffsets: Partial<Coords>,
  selector = '.scroll',
) {
  await page.waitForSelector(selector);
  return await page.evaluate(
    ({x, y, selector}: Partial<Coords> & {selector: string}) => {
      const scroll = document.querySelector(selector);
      if (scroll) {
        if (x != null) {
          scroll.scrollLeft = x;
        }
        if (y != null) {
          scroll.scrollTop = y;
        }
      }
    },
    {...scrollOffsets, selector},
  );
}
