import {expect, test} from '@playwright/test';

import {click} from './utils/click';

const RIGHT_CLIENT_RECT = {x: 600, y: 5};
const LEFT_CLIENT_RECT = {x: 50, y: 45};

test('chooses right client rect placed on bottom', async ({page}) => {
  await page.goto('http://localhost:1234/inline');
  await page.hover('.container strong', {position: RIGHT_CLIENT_RECT});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'right-client-rect-bottom.png',
  );
});

test('chooses right client rect placed on top', async ({page}) => {
  await page.goto('http://localhost:1234/inline');
  await click(page, '[data-testid="placement-top"]');
  await page.hover('.container strong', {position: RIGHT_CLIENT_RECT});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'right-client-rect-top.png',
  );
});

test('chooses left client rect placed on bottom', async ({page}) => {
  await page.goto('http://localhost:1234/inline');
  await page.hover('.container strong', {position: LEFT_CLIENT_RECT});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'left-client-rect-bottom.png',
  );
});

test('chooses left client rect placed on top', async ({page}) => {
  await page.goto('http://localhost:1234/inline');
  await click(page, '[data-testid="placement-top"]');
  await page.hover('.container strong', {position: LEFT_CLIENT_RECT});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'left-client-rect-top.png',
  );
});

// FIXME: chooses left rect unexpectedly
test.skip('chooses right client rect placed on the right', async ({page}) => {
  await page.goto('http://localhost:1234/inline');
  await click(page, '[data-testid="placement-right"]');
  await page.hover('.container strong', {position: RIGHT_CLIENT_RECT});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'right-client-rect-right.png',
  );
});

test('chooses left client rect placed on the right', async ({page}) => {
  await page.goto('http://localhost:1234/inline');
  await click(page, '[data-testid="placement-right"]');
  await page.hover('.container strong', {position: LEFT_CLIENT_RECT});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'right-client-rect-right.png',
  );
});

test('chooses right client rect placed on the left', async ({page}) => {
  await page.goto('http://localhost:1234/inline');
  await click(page, '[data-testid="placement-left"]');
  await page.hover('.container strong', {position: RIGHT_CLIENT_RECT});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'right-client-rect-left.png',
  );
});

test('chooses left client rect placed on the left', async ({page}) => {
  await page.goto('http://localhost:1234/inline');
  await click(page, '[data-testid="placement-left"]');
  await page.hover('.container strong', {position: LEFT_CLIENT_RECT});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'left-client-rect-left.png',
  );
});

test('connected placed on top', async ({page}) => {
  await page.goto('http://localhost:1234/inline');
  await click(page, '[data-testid="placement-top"]');
  await click(page, '[data-testid="connected-2-joined"]');
  await page.hover('.container strong', {position: LEFT_CLIENT_RECT});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'connected-top.png',
  );
});

test('connected placed on bottom', async ({page}) => {
  await page.goto('http://localhost:1234/inline');
  await click(page, '[data-testid="connected-2-joined"]');
  await page.hover('.container strong', {position: RIGHT_CLIENT_RECT});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'connected-bottom.png',
  );
});

test('connected placed on left', async ({page}) => {
  await page.goto('http://localhost:1234/inline');
  await click(page, '[data-testid="placement-left"]');
  await click(page, '[data-testid="connected-2-joined"]');
  await page.hover('.container strong', {position: RIGHT_CLIENT_RECT});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'connected-left.png',
  );
});

test('connected placed on right', async ({page}) => {
  await page.goto('http://localhost:1234/inline');
  await click(page, '[data-testid="placement-right"]');
  await click(page, '[data-testid="connected-2-joined"]');

  await page.hover('.container strong', {position: LEFT_CLIENT_RECT});
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'connected-right.png',
  );
});

test('chooses rect based on placement without any mouse coords', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/inline');
  await page.hover('.container strong', {position: RIGHT_CLIENT_RECT});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'first-rect-no-coords.png',
  );
});

test('chooses rect based on placement without any mouse coords bottom', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/inline');
  await click(page, '[data-testid="open-true"]');

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'left-rect-no-coords.png',
  );
});

test('chooses rect based on placement without any mouse coords top', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/inline');
  await click(page, '[data-testid="open-true"]');
  await click(page, '[data-testid="placement-top"]');

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'right-rect-no-coords.png',
  );
});

test('correctly centers over two rects', async ({page}) => {
  await page.goto('http://localhost:1234/inline');
  await click(page, '[data-testid="placement-left"]');
  await click(page, '[data-testid="connected-3"]');
  await click(page, '[data-testid="open-true"]');

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'left-connected-3.png',
  );
});
