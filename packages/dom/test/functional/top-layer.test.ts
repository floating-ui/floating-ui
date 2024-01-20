import {expect, test} from '@playwright/test';

import {click} from './utils/click';

test('top-layer, popover, transform', async ({page}) => {
  await page.goto('http://localhost:1234/top-layer');
  await click(page, '#reference');

  expect(await page.locator('.host').screenshot()).toMatchSnapshot(
    `top-layer.popover.transform.png`,
  );
});

test('top-layer, dialog, transform', async ({page}) => {
  await page.goto('http://localhost:1234/top-layer');
  await click(page, `[data-testid="withPopover-false"]`);
  await click(page, '#reference');

  expect(await page.locator('.host').screenshot()).toMatchSnapshot(
    `top-layer.dialog.transform.png`,
  );
});

test('top-layer, popover, no transform', async ({page}) => {
  await page.goto('http://localhost:1234/top-layer');
  await click(page, `[data-testid="withTransform-false"]`);
  await click(page, '#reference');

  expect(await page.locator('.host').screenshot()).toMatchSnapshot(
    `top-layer.popover.no-transform.png`,
  );
});

test('top-layer, dialog, no transform', async ({page}) => {
  await page.goto('http://localhost:1234/top-layer');
  await click(page, `[data-testid="withTransform-false"]`);
  await click(page, `[data-testid="withPopover-false"]`);
  await click(page, '#reference');

  expect(await page.locator('.host').screenshot()).toMatchSnapshot(
    `top-layer.dialog.no-transform.png`,
  );
});

test('top-layer, popover, transform, stack on popover', async ({page}) => {
  await page.goto('http://localhost:1234/top-layer');
  await click(page, `[data-testid="stackedOn-popover"]`);
  await click(page, '#stack');
  await click(page, '#reference');

  expect(await page.locator('.host').screenshot()).toMatchSnapshot(
    `top-layer.popover.transform.on-popover.png`,
  );
});

test.skip('top-layer, dialog, transform, stack on popover', async ({page}) => {
  // Not currently possible via the [popover] API as the descendant
  // <dialog> will close the ancestor <[popover]> element while opening.
  await page.goto('http://localhost:1234/top-layer');
  await click(page, `[data-testid="withPopover-false"]`);
  await click(page, `[data-testid="stackedOn-popover"]`);
  await click(page, '#stack');
  await click(page, '#reference');

  expect(await page.locator('.host').screenshot()).toMatchSnapshot(
    `top-layer.dialog.transform.on-popover.png`,
  );
});

test('top-layer, popover, no transform, stack on popover', async ({page}) => {
  await page.goto('http://localhost:1234/top-layer');
  await click(page, `[data-testid="withTransform-false"]`);
  await click(page, `[data-testid="stackedOn-popover"]`);
  await click(page, '#stack');
  await click(page, '#reference');

  expect(await page.locator('.host').screenshot()).toMatchSnapshot(
    `top-layer.popover.no-transform.on-popover.png`,
  );
});

test.skip('top-layer, dialog, no transform, stack on popover', async ({
  page,
}) => {
  // Not currently possible via the [popover] API as the descendant
  // <dialog> will close the ancestor <[popover]> element while opening.
  await page.goto('http://localhost:1234/top-layer');
  await click(page, `[data-testid="withTransform-false"]`);
  await click(page, `[data-testid="withPopover-false"]`);
  await click(page, `[data-testid="stackedOn-popover"]`);
  await click(page, '#stack');
  await click(page, '#reference');

  expect(await page.locator('.host').screenshot()).toMatchSnapshot(
    `top-layer.dialog.no-transform.on-popover.png`,
  );
});

test('top-layer, popover, transform, stack on dialog', async ({page}) => {
  await page.goto('http://localhost:1234/top-layer');
  await click(page, `[data-testid="stackedOn-dialog"]`);
  await click(page, '#stack');
  await click(page, '#reference');

  expect(await page.locator('.host').screenshot()).toMatchSnapshot(
    `top-layer.popover.transform.on-dialog.png`,
  );
});

test('top-layer, dialog, transform, stack on dialog', async ({page}) => {
  await page.goto('http://localhost:1234/top-layer');
  await click(page, `[data-testid="withPopover-false"]`);
  await click(page, `[data-testid="stackedOn-dialog"]`);
  await click(page, '#stack');
  await click(page, '#reference');

  expect(await page.locator('.host').screenshot()).toMatchSnapshot(
    `top-layer.dialog.transform.on-dialog.png`,
  );
});

test('top-layer, popover, no transform, stack on dialog', async ({page}) => {
  await page.goto('http://localhost:1234/top-layer');
  await click(page, `[data-testid="withTransform-false"]`);
  await click(page, `[data-testid="stackedOn-dialog"]`);
  await click(page, '#stack');
  await click(page, '#reference');

  expect(await page.locator('.host').screenshot()).toMatchSnapshot(
    `top-layer.popover.no-transform.on-dialog.png`,
  );
});

test('top-layer, dialog, no transform, stack on dialog', async ({page}) => {
  await page.goto('http://localhost:1234/top-layer');
  await click(page, `[data-testid="withTransform-false"]`);
  await click(page, `[data-testid="withPopover-false"]`);
  await click(page, `[data-testid="stackedOn-dialog"]`);
  await click(page, '#stack');
  await click(page, '#reference');

  expect(await page.locator('.host').screenshot()).toMatchSnapshot(
    `top-layer.dialog.no-transform.on-dialog.png`,
  );
});

test('flip collision', async ({page}) => {
  await page.goto('http://localhost:1234/top-layer');
  await click(page, '[data-testid="collision-true"]');
  await click(page, '#reference');

  await page.evaluate(() => window.scrollTo(0, 86));

  expect(await page.locator('.host').screenshot()).toMatchSnapshot(
    `top-layer.no-flip.png`,
  );

  await page.evaluate(() => window.scrollTo(0, 96));

  expect(await page.locator('.host').screenshot()).toMatchSnapshot(
    `top-layer.flip.png`,
  );
});

test('containing block margins', async ({page}) => {
  await page.goto('http://localhost:1234/top-layer');
  await click(page, '[data-testid="withMargin-true"]');
  await click(page, '#reference');

  expect(await page.locator('.host').screenshot()).toMatchSnapshot(
    `top-layer.containing-block-margin.png`,
  );
});
