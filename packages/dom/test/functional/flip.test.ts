import {test, expect} from '@playwright/test';
import {click} from './utils/click';

test('does not flip when `mainAxis` is false', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="mainAxis-false"]`);

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollTop = 500;
    }
  });

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `mainAxis-false.png`
  );
});

test('does flip when `mainAxis` is true', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="mainAxis-true"]`);

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollTop = 500;
    }
  });

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `mainAxis-true.png`
  );
});

test('does not flip when `crossAxis` is false', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="crossAxis-false"]`);
  await click(page, `[data-testid="fallbackPlacements-all"]`);

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollLeft = 800;
    }
  });

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `crossAxis-false.png`
  );
});

test('does flip when `crossAxis` is true', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="crossAxis-true"]`);
  await click(page, `[data-testid="fallbackPlacements-all"]`);

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollLeft = 800;
    }
  });

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `crossAxis-true.png`
  );
});

test('does not flip when `fallbackPlacements` is an empty array', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="fallbackPlacements-[]"]`);

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollTop = 500;
    }
  });

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackPlacements-empty-array.png`
  );
});

test('fallbackPlacements: all', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="placement-top-start"]`);
  await click(page, `[data-testid="fallbackPlacements-all"]`);

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-all-top-start.png`
  );

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollLeft = 675;
      scroll.scrollTop = 585;
    }
  });
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-top.png`
  );

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollLeft = 735;
      scroll.scrollTop = 585;
    }
  });
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-top-end.png`
  );

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollLeft = 735;
      scroll.scrollTop = 700;
    }
  });
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-right-start.png`
  );

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollLeft = 735;
      scroll.scrollTop = 775;
    }
  });
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-right.png`
  );

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollLeft = 735;
      scroll.scrollTop = 825;
    }
  });
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-right-end.png`
  );

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollLeft = 735;
      scroll.scrollTop = 850;
    }
  });
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-bottom-end.png`
  );

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollLeft = 375;
      scroll.scrollTop = 850;
    }
  });
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-bottom.png`
  );

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollLeft = 325;
      scroll.scrollTop = 850;
    }
  });
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-bottom-start.png`
  );

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollLeft = 250;
      scroll.scrollTop = 800;
    }
  });
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-left-end.png`
  );

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollLeft = 250;
      scroll.scrollTop = 450;
    }
  });
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-left.png`
  );

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollLeft = 250;
      scroll.scrollTop = 400;
    }
  });
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-left-start.png`
  );
});

test('fallbackStrategy: "bestFit"', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="fallbackStrategy-bestFit"]`);

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollLeft = 300;
      scroll.scrollTop = 315;
    }
  });

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-bestFit.png`
  );
});

test('fallbackStrategy: "initialPlacement"', async ({page}) => {
  await page.goto('http://localhost:1234/flip');
  await click(page, `[data-testid="fallbackStrategy-initialPlacement"]`);

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollLeft = 300;
      scroll.scrollTop = 315;
    }
  });

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `fallbackStrategy-initialPlacement.png`
  );
});
