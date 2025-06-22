import {expect, test} from '@playwright/test';

import {click} from './utils/click';
import {scroll} from './utils/scroll';

test('does not flip when `side` is false', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="side-false"]`);

  await scroll(page, {y: 500});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `side-false.png`,
  );
});

test('does flip when `side` is true', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="side-true"]`);

  await scroll(page, {y: 500});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `side-true.png`,
  );
});

test('does not flip when `align` is false', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="align-false"]`);
  await click(page, `[data-testid="fallbackPlacements-all"]`);

  await scroll(page, {x: 800});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `align-false.png`,
  );
});

test('does flip when `align` is true', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="align-true"]`);
  await click(page, `[data-testid="fallbackPlacements-all"]`);

  await scroll(page, {x: 800});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `align-true.png`,
  );
});

test('does not flip when `fallbackPlacements` is an empty array', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="fallbackPlacements-[]"]`);

  await scroll(page, {y: 500});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackPlacements-empty-array.png`,
  );
});

test('fallbackPlacements: all', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="placement-top-start"]`);
  await click(page, `[data-testid="fallbackPlacements-all"]`);

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-all-top-start.png`,
  );

  await scroll(page, {x: 675, y: 585});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-top.png`,
  );

  await scroll(page, {x: 735, y: 585});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-top-end.png`,
  );

  await scroll(page, {x: 735, y: 700});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-right-start.png`,
  );

  await scroll(page, {x: 735, y: 775});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-right.png`,
  );

  await scroll(page, {x: 735, y: 825});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-right-end.png`,
  );

  await scroll(page, {x: 735, y: 850});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-bottom-end.png`,
  );

  await scroll(page, {x: 375, y: 850});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-bottom.png`,
  );

  await scroll(page, {x: 325, y: 850});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-bottom-start.png`,
  );

  await scroll(page, {x: 250, y: 800});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-left-end.png`,
  );

  await scroll(page, {x: 250, y: 450});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-left.png`,
  );

  await scroll(page, {x: 250, y: 400});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-left-start.png`,
  );
});

test('fallbackStrategy: "best-fit"', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="fallbackStrategy-best-fit"]`);

  await scroll(page, {x: 300, y: 315});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-best-fit.png`,
  );
});

test('fallbackStrategy: "initial-placement"', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="fallbackStrategy-initial-placement"]`);

  await scroll(page, {x: 300, y: 315});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-initial-placement.png`,
  );
});

test('falls back to only checking side overflow first', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="placement-right"]`);
  await click(page, `[data-testid="shift-true"]`);

  await scroll(page, {x: 780, y: 600});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallback-shift-side-axis.png`,
  );
});

test('when align: "align" and fallbackAxisSideDirection: "end", does not flip to the perpendicular side if preferred side has no side axis overflow', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="placement-left"]`);
  await click(page, `[data-testid="align-align"]`);
  await click(page, `[data-testid="shift-true"]`);
  await click(page, `[data-testid="fallbackAxisSideDirection-end"]`);

  await scroll(page, {x: 400, y: 600});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `align-align-fallback-axis-side-left.png`,
  );

  await scroll(page, {x: 400, y: 350});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `align-align-fallback-axis-side-remains-left.png`,
  );

  await scroll(page, {x: 480, y: 600});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `align-align-fallback-axis-side-chooses-bottom.png`,
  );

  await scroll(page, {x: 610, y: 320});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `align-align-fallback-axis-side-chooses-right.png`,
  );
});
