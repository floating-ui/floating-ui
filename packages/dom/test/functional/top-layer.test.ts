import {expect, test} from '@playwright/test';

import {click} from './utils/click';

['fixed', 'absolute'].forEach((strategy) => {
  test(`top-layer, popover, transform [${strategy}]`, async ({page}) => {
    await page.goto('http://localhost:1234/top-layer');
    await click(page, `[data-testid="strategy-${strategy}"]`);
    await click(page, '#reference');

    expect(await page.locator('.host').screenshot()).toMatchSnapshot(
      `top-layer.popover.transform.${strategy}.png`,
    );
  });

  test(`top-layer, dialog, transform [${strategy}]`, async ({page}) => {
    await page.goto('http://localhost:1234/top-layer');
    await click(page, `[data-testid="strategy-${strategy}"]`);
    await click(page, `[data-testid="withPopover-false"]`);
    await click(page, '#reference');

    expect(await page.locator('.host').screenshot()).toMatchSnapshot(
      `top-layer.dialog.transform.${strategy}.png`,
    );
  });

  test(`top-layer, popover, no transform [${strategy}]`, async ({page}) => {
    await page.goto('http://localhost:1234/top-layer');
    await click(page, `[data-testid="strategy-${strategy}"]`);
    await click(page, `[data-testid="withTransform-false"]`);
    await click(page, '#reference');

    expect(await page.locator('.host').screenshot()).toMatchSnapshot(
      `top-layer.popover.no-transform.${strategy}.png`,
    );
  });

  test(`top-layer, dialog, no transform [${strategy}]`, async ({page}) => {
    await page.goto('http://localhost:1234/top-layer');
    await click(page, `[data-testid="strategy-${strategy}"]`);
    await click(page, `[data-testid="withTransform-false"]`);
    await click(page, `[data-testid="withPopover-false"]`);
    await click(page, '#reference');

    expect(await page.locator('.host').screenshot()).toMatchSnapshot(
      `top-layer.dialog.no-transform.${strategy}.png`,
    );
  });

  test(`top-layer, popover, transform, stack on popover [${strategy}]`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/top-layer');
    await click(page, `[data-testid="strategy-${strategy}"]`);
    await click(page, `[data-testid="stackedOn-popover"]`);
    await click(page, '#stack');
    await click(page, '#reference');

    expect(await page.locator('.host').screenshot()).toMatchSnapshot(
      `top-layer.popover.transform.on-popover.${strategy}.png`,
    );
  });

  test.skip(`top-layer, dialog, transform, stack on popover [${strategy}]`, async ({
    page,
  }) => {
    // Not currently possible via the [popover] API as the descendant
    // <dialog> will close the ancestor <[popover]> element while opening.
    await page.goto('http://localhost:1234/top-layer');
    await click(page, `[data-testid="strategy-${strategy}"]`);
    await click(page, `[data-testid="withPopover-false"]`);
    await click(page, `[data-testid="stackedOn-popover"]`);
    await click(page, '#stack');
    await click(page, '#reference');

    expect(await page.locator('.host').screenshot()).toMatchSnapshot(
      `top-layer.dialog.transform.on-popover.${strategy}.png`,
    );
  });

  test(`top-layer, popover, no transform, stack on popover [${strategy}]`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/top-layer');
    await click(page, `[data-testid="strategy-${strategy}"]`);
    await click(page, `[data-testid="withTransform-false"]`);
    await click(page, `[data-testid="stackedOn-popover"]`);
    await click(page, '#stack');
    await click(page, '#reference');

    expect(await page.locator('.host').screenshot()).toMatchSnapshot(
      `top-layer.popover.no-transform.on-popover.${strategy}.png`,
    );
  });

  test.skip(`top-layer, dialog, no transform, stack on popover [${strategy}]`, async ({
    page,
  }) => {
    // Not currently possible via the [popover] API as the descendant
    // <dialog> will close the ancestor <[popover]> element while opening.
    await page.goto('http://localhost:1234/top-layer');
    await click(page, `[data-testid="strategy-${strategy}"]`);
    await click(page, `[data-testid="withTransform-false"]`);
    await click(page, `[data-testid="withPopover-false"]`);
    await click(page, `[data-testid="stackedOn-popover"]`);
    await click(page, '#stack');
    await click(page, '#reference');

    expect(await page.locator('.host').screenshot()).toMatchSnapshot(
      `top-layer.dialog.no-transform.on-popover.${strategy}.png`,
    );
  });

  test(`top-layer, popover, transform, stack on dialog [${strategy}]`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/top-layer');
    await click(page, `[data-testid="strategy-${strategy}"]`);
    await click(page, `[data-testid="stackedOn-dialog"]`);
    await click(page, '#stack');
    await click(page, '#reference');

    expect(await page.locator('.host').screenshot()).toMatchSnapshot(
      `top-layer.popover.transform.on-dialog.${strategy}.png`,
    );
  });

  test(`top-layer, dialog, transform, stack on dialog [${strategy}]`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/top-layer');
    await click(page, `[data-testid="strategy-${strategy}"]`);
    await click(page, `[data-testid="withPopover-false"]`);
    await click(page, `[data-testid="stackedOn-dialog"]`);
    await click(page, '#stack');
    await click(page, '#reference');

    expect(await page.locator('.host').screenshot()).toMatchSnapshot(
      `top-layer.dialog.transform.on-dialog.${strategy}.png`,
    );
  });

  test(`top-layer, popover, no transform, stack on dialog [${strategy}]`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/top-layer');
    await click(page, `[data-testid="strategy-${strategy}"]`);
    await click(page, `[data-testid="withTransform-false"]`);
    await click(page, `[data-testid="stackedOn-dialog"]`);
    await click(page, '#stack');
    await click(page, '#reference');

    expect(await page.locator('.host').screenshot()).toMatchSnapshot(
      `top-layer.popover.no-transform.on-dialog.${strategy}.png`,
    );
  });

  test(`top-layer, dialog, no transform, stack on dialog [${strategy}]`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/top-layer');
    await click(page, `[data-testid="strategy-${strategy}"]`);
    await click(page, `[data-testid="withTransform-false"]`);
    await click(page, `[data-testid="withPopover-false"]`);
    await click(page, `[data-testid="stackedOn-dialog"]`);
    await click(page, '#stack');
    await click(page, '#reference');

    expect(await page.locator('.host').screenshot()).toMatchSnapshot(
      `top-layer.dialog.no-transform.on-dialog.${strategy}.png`,
    );
  });

  test(`window scroll [${strategy}]`, async ({page}) => {
    await page.goto('http://localhost:1234/top-layer');
    await click(page, `[data-testid="strategy-${strategy}"]`);
    await page.evaluate(() => window.scrollTo(0, 100));
    await click(page, '#reference');

    expect(await page.locator('.host').screenshot()).toMatchSnapshot(
      `top-layer.window-scroll.${strategy}.png`,
    );
  });

  test(`flip collision [${strategy}]`, async ({page}) => {
    await page.goto('http://localhost:1234/top-layer');
    await click(page, `[data-testid="strategy-${strategy}"]`);
    await click(page, '[data-testid="collision-true"]');
    await click(page, '#reference');

    await page.evaluate(() => window.scrollTo(0, 86));

    expect(await page.locator('.host').screenshot()).toMatchSnapshot(
      `top-layer.no-flip.${strategy}.png`,
    );

    await page.evaluate(() => window.scrollTo(0, 96));

    expect(await page.locator('.host').screenshot()).toMatchSnapshot(
      `top-layer.flip.${strategy}.png`,
    );
  });

  test(`containing block margins [${strategy}]`, async ({page}) => {
    await page.goto('http://localhost:1234/top-layer');
    await click(page, `[data-testid="strategy-${strategy}"]`);
    await click(page, '[data-testid="withMargin-true"]');
    await click(page, '#reference');

    expect(await page.locator('.host').screenshot()).toMatchSnapshot(
      `top-layer.containing-block-margin.${strategy}.png`,
    );
  });

  test(`non-layout styles [${strategy}]`, async ({page}) => {
    await page.goto('http://localhost:1234/top-layer');
    await click(page, `[data-testid="strategy-${strategy}"]`);
    await click(page, '[data-testid="layoutStyles-false"]');
    await click(page, '#reference');

    expect(await page.locator('.host').screenshot()).toMatchSnapshot(
      `top-layer.non-layout-styles.${strategy}.png`,
    );
  });

  test(`non-layout styles, dialog [${strategy}]`, async ({page}) => {
    await page.goto('http://localhost:1234/top-layer');
    await click(page, `[data-testid="strategy-${strategy}"]`);
    await click(page, '[data-testid="layoutStyles-false"]');
    await click(page, `[data-testid="stackedOn-dialog"]`);
    await click(page, '#stack');
    await click(page, '#reference');

    expect(await page.locator('.host').screenshot()).toMatchSnapshot(
      `top-layer.non-layout-styles-dialog.${strategy}.png`,
    );
  });
});

test('fixed inside dialog with outer containing block', async ({page}) => {
  await page.goto('http://localhost:1234/top-layer');
  await click(page, '[data-testid="outer-true"]');

  expect(await page.locator('#outer-dialog').screenshot()).toMatchSnapshot(
    `top-layer.dialog.outer.png`,
  );
});

test('top layer containing block with inner floating element', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/top-layer');
  await click(page, '[data-testid="inner-true"]');

  expect(await page.locator('#inner-dialog').screenshot()).toMatchSnapshot(
    `top-layer.dialog.inner.png`,
  );
});
