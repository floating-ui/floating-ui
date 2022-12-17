import {test, expect} from '@playwright/test';
import {allPlacements} from '../visual/utils/allPlacements';
import {click} from './utils/click';

allPlacements.forEach((placement) => {
  test(`arrow should be centered to the reference ${placement}`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/arrow');
    await click(page, `[data-testid="placement-${placement}"]`);

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${placement}.png`
    );
  });
});

allPlacements.forEach((placement) => {
  test(`arrow should not overflow floating element ${placement}`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/arrow');
    await click(page, `[data-testid="placement-${placement}"]`);

    await page.evaluate(() => {
      const [floatingTarget] = Array.from(
        document.querySelectorAll(
          `input[type="range"]`
        ) as NodeListOf<HTMLInputElement>
      );

      if (floatingTarget) {
        floatingTarget.value = '50';
      }

      (window as any).__handleSizeChange_floating({target: floatingTarget});
    });

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${placement}-no-overflow.png`
    );
  });
});

allPlacements.forEach((placement) => {
  test(`arrow should perform internal shift ${placement}`, async ({page}) => {
    await page.goto('http://localhost:1234/arrow');
    await click(page, `[data-testid="placement-${placement}"]`);

    await page.evaluate(() => {
      const [floatingTarget, referenceTarget, arrowTarget] = Array.from(
        document.querySelectorAll(
          `input[type="range"]`
        ) as NodeListOf<HTMLInputElement>
      );

      if (floatingTarget) {
        floatingTarget.value = '100';
      }

      if (referenceTarget) {
        referenceTarget.value = '25';
      }

      if (arrowTarget) {
        arrowTarget.value = '10';
      }

      (window as any).__handleSizeChange_floating({target: floatingTarget});
      (window as any).__handleSizeChange_reference({target: referenceTarget});
      (window as any).__handleSizeChange_reference({target: arrowTarget});
    });

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${placement}-internal-shift.png`
    );
  });
});

['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end'].forEach(
  (placement) => {
    test(`arrow should not be centered due to external shift ${placement}`, async ({
      page,
    }) => {
      await page.goto('http://localhost:1234/arrow');
      await click(page, `[data-testid="placement-${placement}"]`);

      await page.evaluate(() => {
        const [floatingTarget, referenceTarget, arrowTarget] = Array.from(
          document.querySelectorAll(
            `input[type="range"]`
          ) as NodeListOf<HTMLInputElement>
        );

        if (floatingTarget) {
          floatingTarget.value = '100';
        }

        if (referenceTarget) {
          referenceTarget.value = '25';
        }

        if (arrowTarget) {
          arrowTarget.value = '10';
        }

        (window as any).__handleSizeChange_floating({target: floatingTarget});
        (window as any).__handleSizeChange_reference({target: referenceTarget});
        (window as any).__handleSizeChange_reference({target: arrowTarget});
      });

      await page.evaluate(() => {
        const scroll = document.querySelector('.scroll');
        if (scroll) {
          scroll.scrollLeft = 740;
        }
      });

      expect(await page.locator('.container').screenshot()).toMatchSnapshot(
        `${placement}-external-shift-y-left.png`
      );

      await page.evaluate(() => {
        const scroll = document.querySelector('.scroll');
        if (scroll) {
          scroll.scrollLeft = 310;
        }
      });

      expect(await page.locator('.container').screenshot()).toMatchSnapshot(
        `${placement}-external-shift-y-right.png`
      );
    });
  }
);

['right', 'right-start', 'right-end', 'left', 'left-start', 'left-end'].forEach(
  (placement) => {
    test(`arrow should not be centered due to external shift ${placement}`, async ({
      page,
    }) => {
      await page.goto('http://localhost:1234/arrow');
      await click(page, `[data-testid="placement-${placement}"]`);

      await page.evaluate(() => {
        const [floatingTarget, referenceTarget, arrowTarget] = Array.from(
          document.querySelectorAll(
            `input[type="range"]`
          ) as NodeListOf<HTMLInputElement>
        );

        if (floatingTarget) {
          floatingTarget.value = '100';
        }

        if (referenceTarget) {
          referenceTarget.value = '25';
        }

        if (arrowTarget) {
          arrowTarget.value = '10';
        }

        (window as any).__handleSizeChange_floating({target: floatingTarget});
        (window as any).__handleSizeChange_reference({target: referenceTarget});
        (window as any).__handleSizeChange_reference({target: arrowTarget});
      });

      await page.evaluate(() => {
        const scroll = document.querySelector('.scroll');
        if (scroll) {
          scroll.scrollTop = 755;
        }
      });

      expect(await page.locator('.container').screenshot()).toMatchSnapshot(
        `${placement}-external-shift-y-top.png`
      );

      await page.evaluate(() => {
        const scroll = document.querySelector('.scroll');
        if (scroll) {
          scroll.scrollTop = 320;
        }
      });

      expect(await page.locator('.container').screenshot()).toMatchSnapshot(
        `${placement}-external-shift-y-bottom.png`
      );
    });
  }
);
