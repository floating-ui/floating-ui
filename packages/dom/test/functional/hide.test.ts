import {expect, test} from '@playwright/test';

import {click} from './utils/click';
import {scroll} from './utils/scroll';

test('yellow once it has escaped', async ({page}) => {
  await page.goto('http://localhost:1234/hide');

  await scroll(page, {y: 450});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `hide-escaped.png`,
  );
});

test('black once reference is hidden', async ({page}) => {
  await page.goto('http://localhost:1234/hide');

  await scroll(page, {y: 300});

  expect(await page.locator('main').screenshot()).toMatchSnapshot(
    `hide-reference-hidden.png`,
  );
});

test('not black or yellow while still within bounds', async ({page}) => {
  await page.goto('http://localhost:1234/hide');

  await scroll(page, {y: 908, x: 264});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `hide-within-bounds.png`,
  );
});

test('black while reference is hidden, without escaping', async ({page}) => {
  await page.goto('http://localhost:1234/hide');

  await scroll(page, {y: 920});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `hide-reference-hidden-no-escape.png`,
  );
});

['a', 'b', 'c', 'd', 'g', 'i', 'p', 'q'].forEach((hierarchy) => {
  test(`floating element is not black ${hierarchy}`, async ({page}) => {
    await page.goto('http://localhost:1234/hide');
    await click(page, `[data-testid="hierarchy-${hierarchy}"]`);

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `not-black-${hierarchy}.png`,
    );
  });
});

['e', 'h'].forEach((hierarchy) => {
  test(`floating element is black ${hierarchy}`, async ({page}) => {
    await page.goto('http://localhost:1234/hide');
    await click(page, `[data-testid="hierarchy-${hierarchy}"]`);

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `black-${hierarchy}.png`,
    );
  });
});

['f'].forEach((hierarchy) => {
  test(`floating element is yellow ${hierarchy}`, async ({page}) => {
    await page.goto('http://localhost:1234/hide');
    await click(page, `[data-testid="hierarchy-${hierarchy}"]`);

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `yellow-${hierarchy}.png`,
    );
  });
});

['j', 'm'].forEach((hierarchy) => {
  test(`floating element should be square, not resized ${hierarchy}`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/hide');
    await click(page, `[data-testid="hierarchy-${hierarchy}"]`);

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `square-${hierarchy}.png`,
    );
  });
});

['k', 'l'].forEach((hierarchy) => {
  test(`floating element should resize its height and not be clipped ${hierarchy}`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/hide');
    await click(page, `[data-testid="hierarchy-${hierarchy}"]`);

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `resize-height-${hierarchy}.png`,
    );
  });
});

['n'].forEach((hierarchy) => {
  test(`floating element should be yellow, not black ${hierarchy}`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/hide');
    await click(page, `[data-testid="hierarchy-${hierarchy}"]`);

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `yellow-not-black-${hierarchy}.png`,
    );
  });
});

['o'].forEach((hierarchy) => {
  test(`floating element should be placed at bottom center ${hierarchy}`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/hide');
    await click(page, `[data-testid="hierarchy-${hierarchy}"]`);

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `bottom-center-${hierarchy}.png`,
    );
  });
});
