import {computePosition, flip, offset, shift} from '@floating-ui/core';
import type {Rect, VirtualElement} from '@floating-ui/core';
import type {View} from 'react-native';
import {expect, test, vi} from 'vitest';

import {createPlatform} from '../src/createPlatform';

vi.mock('react-native', () => ({
  Dimensions: {get: () => ({width: 411, height: 800})},
  Platform: {OS: 'android'},
  StatusBar: {currentHeight: 24},
}));

function createView({x, y, width, height}: Rect, parent = {x: 0, y: 0}) {
  return {
    measure: vi.fn((callback: Parameters<View['measure']>[0]) => {
      callback(x, y, width, height, x + parent.x, y + parent.y);
    }),
    measureInWindow: vi.fn(
      (callback: Parameters<View['measureInWindow']>[0]) => {
        callback(x + parent.x, y + parent.y, width, height);
      },
    ),
  };
}

function createTestPlatform(
  options: Partial<Parameters<typeof createPlatform>[0]> = {},
) {
  return createPlatform({
    offsetParent: undefined!,
    sameScrollView: true,
    scrollOffsets: {x: 0, y: 0},
    ...options,
  });
}

const floating = createView({x: 0, y: 0, width: 260, height: 100});

test.each([
  {parent: {x: 0, y: 0}, scrollOffsets: {x: 0, y: 0}},
  {parent: {x: 205.5, y: 300}, scrollOffsets: {x: 0, y: 0}},
  {parent: {x: 205.5, y: 220}, scrollOffsets: {x: 0, y: 80}},
  {parent: {x: 125.5, y: 220}, scrollOffsets: {x: 80, y: 80}},
])('shift uses viewport coordinates: %o', async ({parent, scrollOffsets}) => {
  const reference = createView({x: 0, y: 150, width: 100, height: 44}, parent);
  const result = await computePosition(reference, floating, {
    placement: 'top',
    middleware: [offset(5), shift({padding: 20})],
    platform: createTestPlatform({scrollOffsets}),
  });

  expect(result.x).toBe(Math.min(Math.max(parent.x - 80, 20), 131) - parent.x);
  expect(result.y).toBe(45);
  expect(result.placement).toBe('top');
  expect(result.x + parent.x).toBeGreaterThanOrEqual(20);
  expect(result.x + parent.x + 260).toBeLessThanOrEqual(391);
});

test('placement stays parent-relative when no shift is needed', async () => {
  const reference = createView(
    {x: 0, y: 0, width: 100, height: 44},
    {x: 150, y: 300},
  );
  const result = await computePosition(reference, floating, {
    placement: 'top',
    middleware: [offset(5), shift({padding: 20})],
    platform: createTestPlatform(),
  });

  expect(result.x).toBe(-80);
  expect(result.y).toBe(-105);
});

test.each([
  {parentY: 300, placement: 'top', expectedY: -105},
  {parentY: 30, placement: 'bottom', expectedY: 49},
])(
  'flip checks the measured viewport origin: %o',
  async ({parentY, placement, expectedY}) => {
    const reference = createView(
      {x: 0, y: 0, width: 100, height: 44},
      {x: 150, y: parentY},
    );
    const result = await computePosition(reference, floating, {
      placement: 'top',
      middleware: [offset(5), flip({padding: 20}), shift({padding: 20})],
      platform: createTestPlatform(),
    });

    expect(result.placement).toBe(placement);
    expect(result.y).toBe(expectedY);
  },
);

test.each([true, false])(
  'clipping stays at viewport origin (sameScrollView: %s)',
  async (sameScrollView) => {
    const platform = createTestPlatform({
      sameScrollView,
      scrollOffsets: {x: 80, y: 120},
    });

    expect(
      await platform.getClippingRect({
        element: floating,
        boundary: 'clippingAncestors',
        rootBoundary: 'viewport',
        strategy: 'absolute',
      }),
    ).toEqual({x: 0, y: 0, width: 411, height: 800});
  },
);

test('explicit offset parent retains its existing conversion', async () => {
  const offsetParent = createView(
    {x: 40, y: 60, width: 300, height: 500},
    {x: 100, y: 200},
  );
  const reference = createView({x: 10, y: 20, width: 100, height: 44});
  const platform = createTestPlatform({
    offsetParent: offsetParent as unknown as View,
  });

  expect(
    await platform.convertOffsetParentRelativeRectToViewportRelativeRect!({
      rect: {x: 5, y: 10, width: 260, height: 100},
      elements: {reference, floating},
      offsetParent,
      strategy: 'absolute',
    }),
  ).toEqual({x: 45, y: 70, width: 260, height: 100});
  expect(reference.measure).not.toHaveBeenCalled();
});

test('virtual references retain viewport coordinates', async () => {
  const reference: VirtualElement = {
    getBoundingClientRect: () => ({
      x: 205.5,
      y: 300,
      width: 100,
      height: 44,
      top: 300,
      left: 205.5,
      right: 305.5,
      bottom: 344,
    }),
  };
  const result = await computePosition(reference, floating, {
    placement: 'top',
    middleware: [offset(5), shift({padding: 20})],
    platform: createTestPlatform(),
  });

  expect(result.x).toBe(125.5);
  expect(result.y).toBe(195);
});

test('window measurements retain Android status bar handling', async () => {
  const reference = createView(
    {x: 0, y: 0, width: 100, height: 44},
    {x: 150, y: 300},
  );
  const result = await computePosition(reference, floating, {
    placement: 'top',
    middleware: [offset(5), shift({padding: 20})],
    platform: createTestPlatform({sameScrollView: false}),
  });

  expect(result.x).toBe(70);
  expect(result.y).toBe(219);
  expect(reference.measure).not.toHaveBeenCalled();
  expect(reference.measureInWindow).toHaveBeenCalledOnce();
});

test('conversion without elements retains the zero-origin fallback', async () => {
  const platform = createTestPlatform();
  const rect = {x: 10, y: 20, width: 260, height: 100};

  expect(
    await platform.convertOffsetParentRelativeRectToViewportRelativeRect!({
      rect,
      offsetParent: undefined,
      strategy: 'absolute',
    }),
  ).toEqual(rect);
});
