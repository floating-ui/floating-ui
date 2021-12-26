import {test, expect} from '@playwright/test';

const RIGHT_CLIENT_RECT = {x: 600, y: 5};
const LEFT_CLIENT_RECT = {x: 50, y: 50};

test('chooses right client rect placed on bottom', async ({page}) => {
  await page.goto('http://localhost:1234/inline');
  await page.hover('.container strong', {position: RIGHT_CLIENT_RECT});
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'right-client-rect-bottom.png'
  );
});

test('chooses right client rect placed on top', async ({page}) => {
  await page.goto('http://localhost:1234/inline');
  await page.click('[data-testid="placement-top"]');
  await page.hover('.container strong', {position: RIGHT_CLIENT_RECT});
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'right-client-rect-top.png'
  );
});

test('chooses left client rect placed on bottom', async ({page}) => {
  await page.goto('http://localhost:1234/inline');
  await page.hover('.container strong', {position: LEFT_CLIENT_RECT});
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'left-client-rect-bottom.png'
  );
});

test('chooses left client rect placed on top', async ({page}) => {
  await page.goto('http://localhost:1234/inline');
  await page.click('[data-testid="placement-top"]');
  await page.hover('.container strong', {position: LEFT_CLIENT_RECT});
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'left-client-rect-top.png'
  );
});

test('chooses left client rect placed on top when it would not fit on top of right rect', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/inline');
  await page.click('[data-testid="placement-top"]');
  await page.evaluate('window.scrollBy(0, 275)');
  await page.hover('.container strong', {position: LEFT_CLIENT_RECT});
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'left-client-rect-top-when-right-top-no-fit.png'
  );
});

test('chooses right client rect placed on the right', async ({page}) => {
  await page.goto('http://localhost:1234/inline');
  await page.click('[data-testid="placement-right"]');
  await page.hover('.container strong', {position: RIGHT_CLIENT_RECT});
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'right-client-rect-right.png'
  );
});

test('chooses left client rect placed on the right', async ({page}) => {
  await page.goto('http://localhost:1234/inline');
  await page.click('[data-testid="placement-right"]');
  await page.hover('.container strong', {position: LEFT_CLIENT_RECT});
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'right-client-rect-right.png'
  );
});

test('chooses right client rect placed on the left', async ({page}) => {
  await page.goto('http://localhost:1234/inline');
  await page.click('[data-testid="placement-left"]');
  await page.hover('.container strong', {position: RIGHT_CLIENT_RECT});
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'right-client-rect-left.png'
  );
});

test('chooses left client rect placed on the left', async ({page}) => {
  await page.goto('http://localhost:1234/inline');
  await page.click('[data-testid="placement-left"]');
  await page.hover('.container strong', {position: LEFT_CLIENT_RECT});
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'left-client-rect-left.png'
  );
});

test('connected placed on top', async ({page}) => {
  await page.goto('http://localhost:1234/inline');
  await page.click('[data-testid="placement-top"]');
  await page.click('[data-testid="connected-true"]');
  await page.hover('.container strong', {position: LEFT_CLIENT_RECT});
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'connected-top.png'
  );
});

test('connected placed on bottom', async ({page}) => {
  await page.goto('http://localhost:1234/inline');
  await page.click('[data-testid="connected-true"]');
  await page.hover('.container strong', {position: RIGHT_CLIENT_RECT});
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'connected-bottom.png'
  );
});

test('connected placed on left', async ({page}) => {
  await page.goto('http://localhost:1234/inline');
  await page.click('[data-testid="placement-left"]');
  await page.click('[data-testid="connected-true"]');
  await page.hover('.container strong', {position: RIGHT_CLIENT_RECT});
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'connected-left.png'
  );
});

test('connected placed on right', async ({page}) => {
  await page.goto('http://localhost:1234/inline');
  await page.click('[data-testid="placement-right"]');
  await page.click('[data-testid="connected-true"]');
  await page.hover('.container strong', {position: LEFT_CLIENT_RECT});
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'connected-right.png'
  );
});

test('chooses first rect when coords are 1.5px off x, y', async ({page}) => {
  await page.goto('http://localhost:1234/inline');

  const position = await page.evaluate(() => {
    const strong = document.querySelector('.container strong') as Element;
    const clientRect = strong.getClientRects()[0];
    const boundingClientRect = strong.getBoundingClientRect();
    return {
      x: clientRect.x - boundingClientRect.x - 1.5,
      y: clientRect.y - boundingClientRect.y - 1.5,
    };
  });

  await page.hover('.container strong', {position});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'first-rect.png'
  );
});

test('chooses rect based on placement without any mouse coords', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/inline');
  await page.hover('.container strong', {position: RIGHT_CLIENT_RECT});
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'first-rect-no-coords.png'
  );
});

test('chooses rect based on placement without any mouse coords bottom', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/inline');
  await page.click('[data-testid="open-true"]');
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'left-rect-no-coords.png'
  );
});

test('chooses rect based on placement without any mouse coords top', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/inline');
  await page.click('[data-testid="placement-top"]');
  await page.click('[data-testid="open-true"]');
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'right-rect-no-coords.png'
  );
});
