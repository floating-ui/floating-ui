import {expect, test} from '@playwright/test';

import {click} from './utils/click';
import {scroll} from './utils/scroll';

test('does not flip when `sideAxis` is false', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="sideAxis-false"]`);

  await scroll(page, {y: 500});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `sideAxis-false.png`,
  );
});

test('does flip when `sideAxis` is true', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="sideAxis-true"]`);

  await scroll(page, {y: 500});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `sideAxis-true.png`,
  );
});

test('does not flip when `alignAxis` is false', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="alignAxis-false"]`);
  await click(page, `[data-testid="fallbackPlacements-all"]`);

  await scroll(page, {x: 800});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `alignAxis-false.png`,
  );
});

test('does flip when `alignAxis` is true', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="alignAxis-true"]`);
  await click(page, `[data-testid="fallbackPlacements-all"]`);

  await scroll(page, {x: 800});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `alignAxis-true.png`,
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
    `failureStrategy-all-top-start.png`,
  );

  await scroll(page, {x: 675, y: 585});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `failureStrategy-top.png`,
  );

  await scroll(page, {x: 735, y: 585});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `failureStrategy-top-end.png`,
  );

  await scroll(page, {x: 735, y: 700});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `failureStrategy-right-start.png`,
  );

  await scroll(page, {x: 735, y: 775});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `failureStrategy-right.png`,
  );

  await scroll(page, {x: 735, y: 825});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `failureStrategy-right-end.png`,
  );

  await scroll(page, {x: 735, y: 850});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `failureStrategy-bottom-end.png`,
  );

  await scroll(page, {x: 375, y: 850});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `failureStrategy-bottom.png`,
  );

  await scroll(page, {x: 325, y: 850});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `failureStrategy-bottom-start.png`,
  );

  await scroll(page, {x: 250, y: 800});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `failureStrategy-left-end.png`,
  );

  await scroll(page, {x: 250, y: 450});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `failureStrategy-left.png`,
  );

  await scroll(page, {x: 250, y: 400});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `failureStrategy-left-start.png`,
  );
});

test('failureStrategy: "best-fit"', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="failureStrategy-best-fit"]`);

  await scroll(page, {x: 300, y: 315});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `failureStrategy-best-fit.png`,
  );
});

test('failureStrategy: "initial-placement"', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="failureStrategy-initial-placement"]`);

  await scroll(page, {x: 300, y: 315});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `failureStrategy-initial-placement.png`,
  );
});

test('falls back to only checking sideAxis overflow first', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="placement-right"]`);
  await click(page, `[data-testid="shift-true"]`);

  await scroll(page, {x: 780, y: 600});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallback-shift-side-axis.png`,
  );
});

test('when alignAxis: "align" and fallbackAxisSideDirection: "end", does not flip to the perpendicular side if preferred side has no sideAxis overflow', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="placement-left"]`);
  await click(page, `[data-testid="alignAxis-align"]`);
  await click(page, `[data-testid="shift-true"]`);
  await click(page, `[data-testid="fallbackAxisSideDirection-end"]`);

  await scroll(page, {x: 400, y: 600});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `align-axis-align-fallback-axis-side-left.png`,
  );

  await scroll(page, {x: 400, y: 350});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `align-axis-align-fallback-axis-side-remains-left.png`,
  );

  await scroll(page, {x: 480, y: 600});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `align-axis-align-fallback-axis-side-chooses-bottom.png`,
  );

  await scroll(page, {x: 610, y: 320});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `align-axis-align-fallback-axis-side-chooses-right.png`,
  );
});
