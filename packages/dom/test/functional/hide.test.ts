import {test, expect} from '@playwright/test';

test('yellow once it has escaped', async ({page}) => {
  await page.goto('http://localhost:1234/hide');

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollTop = 450;
    }
  });

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `hide-escaped.png`
  );
});

test('black once reference is hidden', async ({page}) => {
  await page.goto('http://localhost:1234/hide');

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollTop = 300;
    }
  });

  expect(await page.locator('main').screenshot()).toMatchSnapshot(
    `hide-reference-hidden.png`
  );
});

test('not black or yellow while still within bounds', async ({page}) => {
  await page.goto('http://localhost:1234/hide');

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollTop = 908;
      scroll.scrollLeft = 264;
    }
  });

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `hide-within-bounds.png`
  );
});

test('black while reference is hidden, without escaping', async ({page}) => {
  await page.goto('http://localhost:1234/hide');

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollTop = 920;
    }
  });

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `hide-reference-hidden-no-escape.png`
  );
});
