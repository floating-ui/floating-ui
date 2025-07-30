import {expect, test} from '@playwright/test';

import {click} from './utils/click';
import {scroll} from './utils/scroll';

test('does not flip when `mainAxis` is false', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="mainAxis-false"]`);

  await scroll(page, {y: 500});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `mainAxis-false.png`,
  );
});

test('does flip when `mainAxis` is true', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="mainAxis-true"]`);

  await scroll(page, {y: 500});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `mainAxis-true.png`,
  );
});

test('does not flip when `crossAxis` is false', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="crossAxis-false"]`);
  await click(page, `[data-testid="fallbackPlacements-all"]`);

  await scroll(page, {x: 800});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `crossAxis-false.png`,
  );
});

test('does flip when `crossAxis` is true', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="crossAxis-true"]`);
  await click(page, `[data-testid="fallbackPlacements-all"]`);

  await scroll(page, {x: 800});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `crossAxis-true.png`,
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

test('fallbackStrategy: "bestFit"', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="fallbackStrategy-bestFit"]`);

  await scroll(page, {x: 300, y: 315});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-bestFit.png`,
  );
});

test('fallbackStrategy: "initialPlacement"', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="fallbackStrategy-initialPlacement"]`);

  await scroll(page, {x: 300, y: 315});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-initialPlacement.png`,
  );
});

test('falls back to only checking mainAxis overflow first', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="placement-right"]`);
  await click(page, `[data-testid="shift-true"]`);

  await scroll(page, {x: 780, y: 600});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallback-shift-main-axis.png`,
  );
});

test('when crossAxis: "alignment" and fallbackAxisSideDirection: "end", does not flip to the perpendicular side if preferred side has no mainAxis overflow', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="placement-left"]`);
  await click(page, `[data-testid="crossAxis-alignment"]`);
  await click(page, `[data-testid="shift-true"]`);
  await click(page, `[data-testid="fallbackAxisSideDirection-end"]`);

  await scroll(page, {x: 400, y: 600});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `cross-axis-alignment-fallback-axis-side-left.png`,
  );

  await scroll(page, {x: 400, y: 350});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `cross-axis-alignment-fallback-axis-side-remains-left.png`,
  );

  await scroll(page, {x: 480, y: 600});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `cross-axis-alignment-fallback-axis-side-chooses-bottom.png`,
  );

  await scroll(page, {x: 610, y: 320});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `cross-axis-alignment-fallback-axis-side-chooses-right.png`,
  );

  await scroll(page, {x: 540, y: 500});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `cross-axis-alignment-fallback-axis-side-chooses-top.png`,
  );
});
