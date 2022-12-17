import {test, expect} from '@playwright/test';
import {click} from './utils/click';
import {SCROLL} from '../visual/spec/IFrame';

SCROLL.forEach((scroll) => {
  test(`[outside] correctly positioned on bottom with clipping detection`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/iframe');
    await click(page, `[data-testid="scroll-${scroll}"]`);

    expect(
      await page.locator('#outside-container').screenshot()
    ).toMatchSnapshot(`outside-${scroll}.png`);
  });

  test(`[inside] correctly positioned on bottom with clipping detection`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/iframe');
    await click(page, `[data-testid="scroll-${scroll}"]`);

    expect(
      await page.locator('#inside-container').screenshot()
    ).toMatchSnapshot(`inside-${scroll}.png`);
  });
});
