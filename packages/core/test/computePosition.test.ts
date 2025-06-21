import {computePosition, type Platform} from '../src';

const reference = {};
const floating = {};
const referenceRect = {x: 0, y: 0, width: 100, height: 100};
const floatingRect = {x: 0, y: 0, width: 50, height: 50};
const platform = {
  getElementRects: () => ({reference: referenceRect, floating: floatingRect}),
  getDimensions: () => ({width: 10, height: 10}),
} as unknown as Platform;

test('returned data', () => {
  const {x, y, side, align, strategy, middlewareData} = computePosition(
    reference,
    floating,
    {
      side: 'top',
      middleware: [{name: 'custom', fn: () => ({data: {property: true}})}],
      platform,
    },
  );

  expect(side).toBe('top');
  expect(align).toBe('center');
  expect(strategy).toBe('absolute');
  expect(x).toBe(25);
  expect(y).toBe(-50);
  expect(middlewareData).toEqual({
    custom: {
      property: true,
    },
  });
});

test('middleware', () => {
  const {x, y} = computePosition(reference, floating, {
    platform,
  });

  const {x: x2, y: y2} = computePosition(reference, floating, {
    platform,
    middleware: [
      {
        name: 'test',
        fn: ({x, y}) => ({x: x + 1, y: y + 1}),
      },
    ],
  });

  expect([x2, y2]).toEqual([x + 1, y + 1]);
});

test('middlewareData', () => {
  const {middlewareData} = computePosition(reference, floating, {
    platform,
    middleware: [
      {
        name: 'test',
        fn: () => ({
          data: {
            hello: true,
          },
        }),
      },
    ],
  });

  expect(middlewareData.test).toEqual({hello: true});
});

test('inline-start and inline-end with RTL', () => {
  const ltrPlatform = {
    ...platform,
    isRTL: () => false,
  };

  const rtlPlatform = {
    ...platform,
    isRTL: () => true,
  };

  // LTR: inline-start should behave like left
  const {
    x: ltrStartX,
    y: ltrStartY,
    side: ltrStartSide,
  } = computePosition(reference, floating, {
    side: 'inline-start',
    platform: ltrPlatform,
  });

  // LTR: inline-end should behave like right
  const {
    x: ltrEndX,
    y: ltrEndY,
    side: ltrEndSide,
  } = computePosition(reference, floating, {
    side: 'inline-end',
    platform: ltrPlatform,
  });

  // RTL: inline-start should behave like right
  const {
    x: rtlStartX,
    y: rtlStartY,
    side: rtlStartSide,
  } = computePosition(reference, floating, {
    side: 'inline-start',
    platform: rtlPlatform,
  });

  // RTL: inline-end should behave like left
  const {
    x: rtlEndX,
    y: rtlEndY,
    side: rtlEndSide,
  } = computePosition(reference, floating, {
    side: 'inline-end',
    platform: rtlPlatform,
  });

  // LTR inline-start = left position
  expect([ltrStartX, ltrStartY]).toEqual([-50, 25]);
  expect(ltrStartSide).toBe('left');

  // LTR inline-end = right position
  expect([ltrEndX, ltrEndY]).toEqual([100, 25]);
  expect(ltrEndSide).toBe('right');

  // RTL inline-start = right position
  expect([rtlStartX, rtlStartY]).toEqual([100, 25]);
  expect(rtlStartSide).toBe('right');

  // RTL inline-end = left position
  expect([rtlEndX, rtlEndY]).toEqual([-50, 25]);
  expect(rtlEndSide).toBe('left');
});
