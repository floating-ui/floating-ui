import {expect, test} from '@playwright/test';

import {click} from './utils/click';
import {scroll} from './utils/scroll';

test('does not shift when `mainAxis` is false', async ({page}) => {
  await page.goto('http://localhost:1234/shift');
  await click(page, `[data-testid="mainAxis-false"]`);

  await scroll(page, {x: 800});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `mainAxis-false.png`,
  );
});

test('does shift when `mainAxis` is true', async ({page}) => {
  await page.goto('http://localhost:1234/shift');
  await click(page, `[data-testid="mainAxis-true"]`);

  await scroll(page, {x: 800});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `mainAxis-true.png`,
  );
});

test('does not shift when `crossAxis` is false', async ({page}) => {
  await page.goto('http://localhost:1234/shift');
  await click(page, `[data-testid="crossAxis-false"]`);

  await scroll(page, {y: 500});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `crossAxis-false.png`,
  );
});

test('does shift when `crossAxis` is true', async ({page}) => {
  await page.goto('http://localhost:1234/shift');
  await click(page, `[data-testid="crossAxis-true"]`);

  await scroll(page, {y: 500});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `crossAxis-true.png`,
  );
});

test('stops shifting once opposite edges are aligned when `limitShift` is used as `limiter` (origin)', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/shift');
  await click(page, `[data-testid="limitShift-true"]`);

  await scroll(page, {x: 150});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `limitShift-origin.png`,
  );
});

test('stops shifting once opposite edges are aligned when `limitShift` is used as `limiter` (non-origin)', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/shift');
  await click(page, `[data-testid="limitShift-true"]`);

  await scroll(page, {x: 900});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `limitShift-non-origin.png`,
  );
});

test('stops shifting on the crossAxis once opposite edges are aligned when `limitShift` is used as `limiter`', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/shift');
  await click(page, `[data-testid="crossAxis-true"]`);
  await click(page, `[data-testid="limitShift-true"]`);

  await scroll(page, {y: 250});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `limitShift.crossAxis.png`,
  );
});

test('limitShift does not limit shift when `crossAxis` is false', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/shift');
  await click(page, `[data-testid="limitShift-true"]`);
  await click(page, `[data-testid="crossAxis-true"]`);
  await click(page, `[data-testid="limitShift.crossAxis-false"]`);

  await scroll(page, {y: 250});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `limitShift.crossAxis-false.png`,
  );
});

test('limitShift does not limit shift when `mainAxis` is false', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/shift');
  await click(page, `[data-testid="limitShift-true"]`);
  await click(page, `[data-testid="limitShift.mainAxis-false"]`);

  await scroll(page, {x: 900});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `limitShift.mainAxis-false.png`,
  );
});

[
  {name: '0', scrollLeft: 900},
  {name: '50', scrollLeft: 900},
  {name: '-50', scrollLeft: 950},
  {name: 'mA: 50', scrollLeft: 800},
  {name: 'cA: 50', scrollTop: 315},
  {name: 'fn => r.width/2', scrollLeft: 800},
  {name: 'fn => cA: f.width/2', scrollTop: 400},
].forEach(({name, ...scrollOffsets}) => {
  ['top', 'bottom'].forEach((placement) => {
    test(`limitShift.offset works for value ${name} ${placement}`, async ({
      page,
    }) => {
      await page.goto('http://localhost:1234/shift');

      await click(page, `[data-testid="placement-${placement}"]`);
      await click(page, `[data-testid="crossAxis-true"]`);
      await click(page, `[data-testid="limitShift-true"]`);
      await click(page, `[data-testid="limitShift.offset-${name}"]`);

      await scroll(page, {
        x: scrollOffsets.scrollLeft,
        y: scrollOffsets.scrollTop,
      });

      expect(await page.locator('.container').screenshot()).toMatchSnapshot(
        `limitShift.offset-${name === '-50' ? 'neg50' : name}-${placement}.png`,
      );
    });
  });
});

['top', 'bottom'].forEach((placement) => {
  test(`offset is correctly added when limitShift is enabled ${placement}`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/shift');

    await click(page, `[data-testid="placement-${placement}"]`);
    await click(page, `[data-testid="offset-10"]`);
    await click(page, `[data-testid="limitShift-true"]`);

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `offset-and-limitShift-${placement}.png`,
    );
  });

  test(`offset is correctly added when limitShift is enabled ${placement} crossAxis stop check`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/shift');

    await click(page, `[data-testid="placement-${placement}"]`);
    await click(page, `[data-testid="offset-10"]`);
    await click(page, `[data-testid="crossAxis-true"]`);
    await click(page, `[data-testid="limitShift-true"]`);

    await scroll(page, {
      y: placement === 'bottom' ? 260 : 950,
    });

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `offset-and-limitShift-stop-check-${placement}.png`,
    );
  });
});
