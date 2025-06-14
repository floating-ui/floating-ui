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
    // @ts-ignore - computePosition() only uses this property
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
