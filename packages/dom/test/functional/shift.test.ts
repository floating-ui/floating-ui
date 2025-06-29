import {expect, test} from '@playwright/test';

import {click} from './utils/click';
import {scroll} from './utils/scroll';

test('does not shift when `alignAxis` is false', async ({page}) => {
  await page.goto('http://localhost:1234/shift');
  await click(page, `[data-testid="alignAxis-false"]`);

  await scroll(page, {x: 800});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `alignAxis-false.png`,
  );
});

test('does shift when `alignAxis` is true', async ({page}) => {
  await page.goto('http://localhost:1234/shift');
  await click(page, `[data-testid="alignAxis-true"]`);

  await scroll(page, {x: 800});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `alignAxis-true.png`,
  );
});

test('does not shift when `sideAxis` is false', async ({page}) => {
  await page.goto('http://localhost:1234/shift');
  await click(page, `[data-testid="sideAxis-false"]`);

  await scroll(page, {y: 500});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `sideAxis-false.png`,
  );
});

test('does shift when `sideAxis` is true', async ({page}) => {
  await page.goto('http://localhost:1234/shift');
  await click(page, `[data-testid="sideAxis-true"]`);

  await scroll(page, {y: 500});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `sideAxis-true.png`,
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

test('stops shifting on the sideAxis once opposite edges are aligned when `limitShift` is used as `limiter`', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/shift');
  await click(page, `[data-testid="sideAxis-true"]`);
  await click(page, `[data-testid="limitShift-true"]`);

  await scroll(page, {y: 250});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `limitShift.sideAxis.png`,
  );
});

test('limitShift does not limit shift when `sideAxis` is false', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/shift');
  await click(page, `[data-testid="limitShift-true"]`);
  await click(page, `[data-testid="sideAxis-true"]`);
  await click(page, `[data-testid="limitShift.sideAxis-false"]`);

  await scroll(page, {y: 250});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `limitShift.sideAxis-false.png`,
  );
});

test('limitShift does not limit shift when `alignAxis` is false', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/shift');
  await click(page, `[data-testid="limitShift-true"]`);
  await click(page, `[data-testid="limitShift.alignAxis-false"]`);

  await scroll(page, {x: 900});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `limitShift.alignAxis-false.png`,
  );
});

[
  {name: '0', scrollLeft: 900},
  {name: '50', scrollLeft: 900},
  {name: '-50', scrollLeft: 950},
  {name: 'aA: 50', scrollLeft: 800},
  {name: 'sA: 50', scrollTop: 315},
  {name: 'fn => r.width/2', scrollLeft: 800},
  {name: 'fn => sA: f.width/2', scrollTop: 400},
].forEach(({name, ...scrollOffsets}) => {
  ['top', 'bottom'].forEach((placement) => {
    test(`limitShift.offset works for value ${name} ${placement}`, async ({
      page,
    }) => {
      await page.goto('http://localhost:1234/shift');

      await click(page, `[data-testid="placement-${placement}"]`);
      await click(page, `[data-testid="sideAxis-true"]`);
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

  test(`offset is correctly added when limitShift is enabled ${placement} sideAxis stop check`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/shift');

    await click(page, `[data-testid="placement-${placement}"]`);
    await click(page, `[data-testid="offset-10"]`);
    await click(page, `[data-testid="sideAxis-true"]`);
    await click(page, `[data-testid="limitShift-true"]`);

    await scroll(page, {
      y: placement === 'bottom' ? 260 : 950,
    });

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `offset-and-limitShift-stop-check-${placement}.png`,
    );
  });
});
