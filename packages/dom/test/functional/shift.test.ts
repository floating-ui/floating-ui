import {test, expect} from '@playwright/test';

test('does not shift when `mainAxis` is false', async ({page}) => {
  await page.goto('http://localhost:1234/shift');
  await page.click(`[data-testid="mainAxis-false"]`);

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollLeft = 800;
    }
  });

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `mainAxis-false.png`
  );
});

test('does shift when `mainAxis` is true', async ({page}) => {
  await page.goto('http://localhost:1234/shift');
  await page.click(`[data-testid="mainAxis-true"]`);

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollLeft = 800;
    }
  });

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `mainAxis-true.png`
  );
});

test('does not shift when `crossAxis` is false', async ({page}) => {
  await page.goto('http://localhost:1234/shift');
  await page.click(`[data-testid="crossAxis-false"]`);

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollTop = 500;
    }
  });

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `crossAxis-false.png`
  );
});

test('does shift when `crossAxis` is true', async ({page}) => {
  await page.goto('http://localhost:1234/shift');
  await page.click(`[data-testid="crossAxis-true"]`);

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollTop = 500;
    }
  });

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `crossAxis-true.png`
  );
});

test('stops shifting once opposite edges are aligned when `limitShift` is used as `limiter` (origin)', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/shift');
  await page.click(`[data-testid="limitShift-true"]`);

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollLeft = 150;
    }
  });

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `limitShift-origin.png`
  );
});

test('stops shifting once opposite edges are aligned when `limitShift` is used as `limiter` (non-origin)', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/shift');
  await page.click(`[data-testid="limitShift-true"]`);

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollLeft = 900;
    }
  });

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `limitShift-non-origin.png`
  );
});

test('stops shifting on the crossAxis once opposite edges are aligned when `limitShift` is used as `limiter`', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/shift');
  await page.click(`[data-testid="crossAxis-true"]`);
  await page.click(`[data-testid="limitShift-true"]`);

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollTop = 250;
    }
  });

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `limitShift.crossAxis.png`
  );
});

test('limitShift does not limit shift when `crossAxis` is false', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/shift');
  await page.click(`[data-testid="limitShift-true"]`);
  await page.click(`[data-testid="crossAxis-true"]`);
  await page.click(`[data-testid="limitShift.crossAxis-false"]`);

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollTop = 250;
    }
  });

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `limitShift.crossAxis-false.png`
  );
});

test('limitShift does not limit shift when `mainAxis` is false', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/shift');
  await page.click(`[data-testid="limitShift-true"]`);
  await page.click(`[data-testid="limitShift.mainAxis-false"]`);

  await page.evaluate(() => {
    const scroll = document.querySelector('.scroll');
    if (scroll) {
      scroll.scrollLeft = 900;
    }
  });

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `limitShift.mainAxis-false.png`
  );
});

[
  {name: '0', scrollLeft: 900},
  {name: '50', scrollLeft: 900},
  {name: '-50', scrollLeft: 950},
  {name: 'mA: 50', scrollLeft: 800},
  // {name: 'cA: 50'},
  {name: 'fn => r.width/2', scrollLeft: 800},
  // {name: 'cA: 50'},
  // {name: 'fn => cA: f.width/2'},
].forEach(({name, ...scrollOffsets}) => {
  // TODO: fix crossAxis offset logic
  test(`limitShift.offset works for value ${name}`, async ({page}) => {
    await page.goto('http://localhost:1234/shift');
    await page.click(`[data-testid="limitShift-true"]`);
    await page.click(`[data-testid="limitShift.offset-${name}"]`);

    await page.evaluate((scrollOffsets) => {
      const scroll = document.querySelector('.scroll');
      if (scroll) {
        Object.assign(scroll, scrollOffsets);
      }
    }, scrollOffsets);

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `limitShift.offset-${name === '-50' ? 'neg50' : name}.png`
    );
  });
});
