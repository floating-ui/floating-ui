import {expect, test} from '@playwright/test';

import {click} from './utils/click';
import {scroll} from './utils/scroll';

test('top-start', async ({page}) => {
  await page.goto('http://localhost:1234/autoPlacement');
  await click(page, `[data-testid="alignment-start"]`);

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `top-start.png`,
  );
});

test('bottom-start', async ({page}) => {
  await page.goto('http://localhost:1234/autoPlacement');
  await click(page, `[data-testid="alignment-start"]`);

  await scroll(page, {y: 610});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `bottom-start.png`,
  );
});

test('right-start', async ({page}) => {
  await page.goto('http://localhost:1234/autoPlacement');
  await click(page, `[data-testid="alignment-start"]`);

  await scroll(page, {x: 550});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `right-start.png`,
  );
});

test('left-start', async ({page}) => {
  await page.goto('http://localhost:1234/autoPlacement');
  await click(page, `[data-testid="alignment-start"]`);

  await scroll(page, {x: 550});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `left-start.png`,
  );
});

test('top', async ({page}) => {
  await page.goto('http://localhost:1234/autoPlacement');
  await click(page, `[data-testid="alignment-null"]`);

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `top.png`,
  );
});

test('bottom', async ({page}) => {
  await page.goto('http://localhost:1234/autoPlacement');
  await click(page, `[data-testid="alignment-null"]`);

  await scroll(page, {y: 650});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `bottom.png`,
  );
});

test('right', async ({page}) => {
  await page.goto('http://localhost:1234/autoPlacement');
  await click(page, `[data-testid="alignment-null"]`);

  await scroll(page, {x: 600});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `right.png`,
  );
});

test('left', async ({page}) => {
  await page.goto('http://localhost:1234/autoPlacement');
  await click(page, `[data-testid="alignment-null"]`);

  await scroll(page, {x: 400});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `left.png`,
  );
});

test('top-end', async ({page}) => {
  await page.goto('http://localhost:1234/autoPlacement');
  await click(page, `[data-testid="alignment-end"]`);

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `top-end.png`,
  );
});

test('bottom-end', async ({page}) => {
  await page.goto('http://localhost:1234/autoPlacement');
  await click(page, `[data-testid="alignment-end"]`);

  await scroll(page, {y: 610});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `bottom-end.png`,
  );
});

test('right-end', async ({page}) => {
  await page.goto('http://localhost:1234/autoPlacement');
  await click(page, `[data-testid="alignment-end"]`);

  await scroll(page, {x: 550});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `right-end.png`,
  );
});

test('left-end', async ({page}) => {
  await page.goto('http://localhost:1234/autoPlacement');
  await click(page, `[data-testid="alignment-end"]`);

  await scroll(page, {x: 550});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `left-end.png`,
  );
});

test('only top, bottom allowed', async ({page}) => {
  await page.goto('http://localhost:1234/autoPlacement');
  await click(page, `[data-testid="alignment-null"]`);
  await click(page, `[data-testid="allowedPlacements-top,bottom"]`);

  await scroll(page, {x: 700, y: 650});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `allowedPlacements-bottom.png`,
  );

  await scroll(page, {x: 700, y: 500});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `allowedPlacements-top.png`,
  );
});

test('only left, right allowed', async ({page}) => {
  await page.goto('http://localhost:1234/autoPlacement');
  await click(page, `[data-testid="alignment-null"]`);
  await click(page, `[data-testid="allowedPlacements-left,right"]`);

  await scroll(page, {x: 550, y: 750});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `allowedPlacements-right.png`,
  );

  await scroll(page, {x: 500, y: 750});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `allowedPlacements-left.png`,
  );
});

test('most space for crossAxis', async ({page}) => {
  await page.goto('http://localhost:1234/autoPlacement');
  await click(page, `[data-testid="crossAxis-true"]`);
  await click(
    page,
    `[data-testid="allowedPlacements-top-start,top-end,bottom-start,bottom-end"]`,
  );

  await scroll(page, {x: 525});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `crossAxis-top-start.png`,
  );

  await scroll(page, {x: 550});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `crossAxis-top-end.png`,
  );

  await scroll(page, {y: 650});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `crossAxis-bottom-end.png`,
  );

  await scroll(page, {x: 500});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `crossAxis-bottom-start.png`,
  );
});

test('placement does not reset', async ({page}) => {
  await page.goto('http://localhost:1234/autoPlacement');
  await click(
    page,
    `[data-testid="allowedPlacements-top-start,top-end,bottom-start,bottom-end"]`,
  );

  await scroll(page, {x: 800});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `reset-top-end.png`,
  );

  await scroll(page, {y: 650});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `reset-bottom-end.png`,
  );

  await scroll(page, {x: 250});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `reset-bottom-start.png`,
  );

  await scroll(page, {y: 500});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `reset-top-start.png`,
  );
});

test('placement is not sticky', async ({page}) => {
  await page.goto('http://localhost:1234/autoPlacement');
  await click(page, `[data-testid="alignment-null"]`);
  await click(page, `[data-testid="shift-true"]`);

  await scroll(page, {x: 700, y: 705});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `sticky-bottom.png`,
  );

  await scroll(page, {x: 700, y: 350});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `sticky-top.png`,
  );

  await scroll(page, {x: 750, y: 725});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `sticky-right-1.png`,
  );

  await scroll(page, {x: 750, y: 350});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `sticky-right-2.png`,
  );
});
