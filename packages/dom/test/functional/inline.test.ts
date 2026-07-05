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

// In RTL the two disjoined line fragments are mirrored relative to LTR: the top
// fragment sits to the left of the bottom fragment. Hovering a fragment should
// still anchor the floating element to the fragment under the pointer.
async function enableRtlDisjoined(page: any) {
  await click(page, '[data-testid="rtl-true"]');
  // Wait for the Hebrew reference to render and wrap into two fragments.
  await page.waitForFunction(() => {
    const strong = document.querySelector('.container strong');
    return strong != null && strong.getClientRects().length === 2;
  });
}

async function hoverLineFragment(page: any, which: 'top' | 'bottom') {
  const position = await page.evaluate((which: 'top' | 'bottom') => {
    const strong = document.querySelector('.container strong') as HTMLElement;
    const box = strong.getBoundingClientRect();
    const rects = Array.from(strong.getClientRects()).sort(
      (a, b) => a.top - b.top,
    );
    const rect = which === 'top' ? rects[0] : rects[rects.length - 1];
    return {
      x: rect.left + rect.width / 2 - box.left,
      y: rect.top + rect.height / 2 - box.top,
    };
  }, which);
  await page.hover('.container strong', {position});
}

test('rtl chooses the top disjoined client rect under the pointer', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/inline');
  await enableRtlDisjoined(page);
  await hoverLineFragment(page, 'top');

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'rtl-top-client-rect.png',
  );
});

test('rtl chooses the bottom disjoined client rect under the pointer', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/inline');
  await enableRtlDisjoined(page);
  await hoverLineFragment(page, 'bottom');

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'rtl-bottom-client-rect.png',
  );
});
