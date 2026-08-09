import {computePosition, detectOverflow} from '../src';
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

test('derives non-element scale without passing it to getScale', async () => {
  let getScaleCalled = false;
  let overflow: Awaited<ReturnType<typeof detectOverflow>> | undefined;

  await computePosition(reference, floating, {
    platform: {
      ...platform,
      getElementRects: () => ({
        reference: {x: 75, y: 25, width: 0, height: 10},
        floating: floatingRect,
      }),
      getClippingRect: () => ({x: 0, y: 0, width: 100, height: 100}),
      getOffsetParent: () => ({}),
      isElement: () => false,
      convertOffsetParentRelativeRectToViewportRelativeRect: ({rect}) => ({
        x: rect.x * 2,
        y: rect.y * 2,
        width: rect.width * 2,
        height: rect.height * 2,
      }),
      getScale: () => {
        getScaleCalled = true;
        throw new Error('getScale() received a non-element');
      },
    },
    middleware: [
      {
        name: 'test',
        async fn(state) {
          overflow = await detectOverflow(state, {
            elementContext: 'reference',
          });
          return {};
        },
      },
    ],
  });

  expect(getScaleCalled).toBe(false);
  expect(overflow).toEqual({top: -25, bottom: -15, left: -75, right: 25});
});

test('derives each axis of a non-uniform non-element scale independently', async () => {
  let overflow: Awaited<ReturnType<typeof detectOverflow>> | undefined;

  await computePosition(reference, floating, {
    platform: {
      ...platform,
      getElementRects: () => ({
        reference: {x: 25, y: 25, width: 50, height: 50},
        floating: floatingRect,
      }),
      getClippingRect: () => ({x: 0, y: 0, width: 100, height: 100}),
      getOffsetParent: () => ({}),
      isElement: () => false,
      // Only the horizontal mapping is scaled, as a custom (e.g. canvas)
      // platform is free to do.
      convertOffsetParentRelativeRectToViewportRelativeRect: ({rect}) => ({
        x: rect.x * 2,
        y: rect.y,
        width: rect.width * 2,
        height: rect.height,
      }),
    },
    middleware: [
      {
        name: 'test',
        async fn(state) {
          overflow = await detectOverflow(state, {
            elementContext: 'reference',
          });
          return {};
        },
      },
    ],
  });

  // The y axis is unscaled, so its corrections must not inherit the x scale.
  expect(overflow).toEqual({top: -25, bottom: -25, left: -25, right: 25});
});
