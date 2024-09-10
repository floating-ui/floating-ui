import type {Dimensions} from '@floating-ui/core';

/**
 * Resizes an element to the provided dimensions.
 */
export async function resize(
  page: any,
  resizeDimensions: Partial<Dimensions>,
  selector = '.resize',
) {
  await page.waitForSelector(selector);
  return await page.evaluate(
    ({width, height, selector}: Partial<Dimensions> & {selector: string}) => {
      const resize = document.querySelector(selector);
      if (resize && resize instanceof HTMLElement) {
        if (width != null) {
          resize.style.width = `${width}px`;
        }
        if (height != null) {
          resize.style.height = `${height}px`;
        }
      }
    },
    {...resizeDimensions, selector},
  );
}
