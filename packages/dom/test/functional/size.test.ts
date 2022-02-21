import {test, expect} from '@playwright/test';
import {allPlacements} from '../visual/utils/allPlacements';
import {click} from './utils/click';

allPlacements.forEach((placement) => {
  test(`correctly sized for placement ${placement}`, async ({page}) => {
    await page.goto('http://localhost:1234/size');
    await click(page, `[data-testid="placement-${placement}"]`);

    await page.evaluate(() => {
      const scroll = document.querySelector('.scroll');
      if (scroll) {
        scroll.scrollLeft = 525;
        scroll.scrollTop = 605;
      }
    });

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${placement}.png`
    );
  });

  test(`placement ${placement} correctly sized with rtl enabled`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/size');
    await click(page, `[data-testid="placement-${placement}"]`);
    await click(page, `[data-testid="rtl-true"]`);
    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${placement}-rtl.png`
    );
  });
});

['bottom', 'top'].forEach((verticalPlacement) => {
  test(`does not overflow due to size ${verticalPlacement}`, async ({page}) => {
    await page.goto('http://localhost:1234/size');
    await click(page, `[data-testid="placement-${verticalPlacement}"]`);

    await page.evaluate(() => {
      const scroll = document.querySelector('.scroll');
      if (scroll) {
        scroll.scrollLeft = 650;
      }
    });

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${verticalPlacement}-left-start.png`
    );

    await page.evaluate(() => {
      const scroll = document.querySelector('.scroll');
      if (scroll) {
        scroll.scrollLeft = 575;
      }
    });

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${verticalPlacement}-left-end.png`
    );

    await page.evaluate(() => {
      const scroll = document.querySelector('.scroll');
      if (scroll) {
        scroll.scrollLeft = 400;
      }
    });

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${verticalPlacement}-right-start.png`
    );

    await page.evaluate(() => {
      const scroll = document.querySelector('.scroll');
      if (scroll) {
        scroll.scrollLeft = 500;
      }
    });

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${verticalPlacement}-right-end.png`
    );
  });
});

['right', 'left'].forEach((horizontalPlacement) => {
  test(`does not overflow due to size ${horizontalPlacement}`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/size');
    await click(page, `[data-testid="placement-${horizontalPlacement}"]`);

    await page.evaluate(() => {
      const scroll = document.querySelector('.scroll');
      if (scroll) {
        scroll.scrollTop = 725;
      }
    });

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${horizontalPlacement}-top-start.png`
    );

    await page.evaluate(() => {
      const scroll = document.querySelector('.scroll');
      if (scroll) {
        scroll.scrollTop = 650;
      }
    });

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${horizontalPlacement}-top-end.png`
    );

    await page.evaluate(() => {
      const scroll = document.querySelector('.scroll');
      if (scroll) {
        scroll.scrollTop = 475;
      }
    });

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${horizontalPlacement}-bottom-start.png`
    );

    await page.evaluate(() => {
      const scroll = document.querySelector('.scroll');
      if (scroll) {
        scroll.scrollLeft = 575;
      }
    });

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${horizontalPlacement}-bottom-end.png`
    );
  });
});
