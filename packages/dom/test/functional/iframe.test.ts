import {expect, test} from '@playwright/test';

import {click} from './utils/click';

[
  [900, 900],
  [1090, 900],
  [665, 900],
  [865, 665],
].forEach((scroll) => {
  test(`[outside] ${scroll} correctly positioned on bottom with clipping detection`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/iframe');
    await click(page, `[data-testid="scroll-${scroll}"]`);

    expect(
      await page.locator('#outside-container').screenshot(),
    ).toMatchSnapshot(`outside-${scroll}.png`);
  });

  test(`[outside-embedded] ${scroll} correctly positioned on bottom with clipping detection`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/iframe');
    await click(page, `[data-testid="scroll-${scroll}"]`);

    expect(
      await page.locator('#outside-embedded-container').screenshot(),
    ).toMatchSnapshot(`outside-embedded-${scroll}.png`);
  });

  test(`[inside] ${scroll} correctly positioned on bottom with clipping detection`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/iframe');
    await click(page, `[data-testid="scroll-${scroll}"]`);

    expect(
      await page.locator('#inside-container').screenshot(),
    ).toMatchSnapshot(`inside-${scroll}.png`);
  });

  test(`[nested] ${scroll} correctly positioned on bottom with clipping detection`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/iframe');
    await click(page, `[data-testid="scroll-${scroll}"]`);

    expect(
      await page.locator('#nested-container').screenshot(),
    ).toMatchSnapshot(`nested-${scroll}.png`);
  });

  test(`[virtual] ${scroll} correctly positioned on bottom with clipping detection`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/iframe');
    await click(page, `[data-testid="scroll-${scroll}"]`);

    expect(
      await page.locator('#virtual-container').screenshot(),
    ).toMatchSnapshot(`virtual-${scroll}.png`);
  });

  test(`[inside-scrollable-parent] ${scroll} correctly positioned on bottom with clipping detection`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/iframe');
    await click(page, `[data-testid="scroll-${scroll}"]`);

    expect(
      await page.locator('#inside-scrollable-container').screenshot(),
    ).toMatchSnapshot(`inside-scrollable-${scroll}.png`);
  });
});
