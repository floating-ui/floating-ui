import {computePosition} from '../src';
import type {Platform} from '../src/types';

const reference = {};
const floating = {};
const referenceRect = {x: 0, y: 0, width: 100, height: 100};
const floatingRect = {x: 0, y: 0, width: 50, height: 50};
const platform = {
  getElementRects: () =>
    Promise.resolve({
      reference: referenceRect,
      floating: floatingRect,
    }),
  getDimensions: () => Promise.resolve({width: 10, height: 10}),
} as unknown as Platform;

test('returned data', async () => {
  const {x, y, placement, strategy, middlewareData} = await computePosition(
    reference,
    floating,
    {
      placement: 'top',
      middleware: [{name: 'custom', fn: () => ({data: {property: true}})}],
      platform,
    },
  );

  expect(placement).toBe('top');
  expect(strategy).toBe('absolute');
  expect(x).toBe(25);
  expect(y).toBe(-50);
  expect(middlewareData).toEqual({
    custom: {
      property: true,
    },
  });
});

test('middleware', async () => {
  const {x, y} = await computePosition(reference, floating, {
    platform,
  });

  const {x: x2, y: y2} = await computePosition(reference, floating, {
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

test('middlewareData', async () => {
  const {middlewareData} = await computePosition(reference, floating, {
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
