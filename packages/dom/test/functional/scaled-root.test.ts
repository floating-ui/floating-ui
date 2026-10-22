import {expect, test} from '@playwright/test';

// A scale transform on the <html> must not be mistaken for a reserved
// `scrollbar-gutter: stable` gutter: the green popup should be shifted flush
// against the right edge of the window, with no gap.
test('shifts flush to the viewport edge with a scaled <html>', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/scaled-root');

  // The popup opens at (0, 0) and moves once its position is computed.
  await expect
    .poll(() =>
      page
        .getByTestId('floating')
        .evaluate((el) => el.getBoundingClientRect().x),
    )
    .toBeGreaterThan(0);

  expect(await page.screenshot()).toMatchSnapshot('scaled-root.png');
});
