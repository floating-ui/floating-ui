import type {SideObject} from '@floating-ui/utils';

import {computePosition, flip} from '../../src';

// https://github.com/floating-ui/floating-ui/issues/3014
// When the floating element is too big to fit on any side, `bestFit` should
// prefer placements that overflow toward the scrollable end of the document
// (bottom/right) over ones that overflow past the start edge (top/left),
// where the overflowed content cannot be scrolled into view.
test('bestFit prefers scrollable-end overflow over start-edge overflow', async () => {
  const overflowByPlacement: Record<string, SideObject> = {
    // Placed above the reference, the floating element sticks 200px past the
    // top of the document: clipped and unreachable by scrolling.
    top: {top: 200, bottom: 0, left: 0, right: 0},
    // Placed below the reference, it sticks 250px past the viewport bottom:
    // more total overflow, but reachable by scrolling down.
    bottom: {top: 0, bottom: 250, left: 0, right: 0},
  };

  const {placement} = await computePosition(
    {},
    {},
    {
      placement: 'top',
      middleware: [flip()],
      platform: {
        getElementRects: () => ({
          reference: {x: 0, y: 0, width: 100, height: 100},
          floating: {x: 0, y: 0, width: 100, height: 300},
        }),
        getDimensions: () => ({width: 100, height: 300}),
        getClippingRect: () => ({x: 0, y: 0, width: 100, height: 100}),
        isRTL: () => Promise.resolve(false),
        detectOverflow: (state) =>
          Promise.resolve(
            overflowByPlacement[state.placement] ?? {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            },
          ),
      },
    },
  );

  expect(placement).toBe('bottom');
});

test('bestFit still picks a slightly clipped start-side placement over a hugely overflowing end-side one', async () => {
  const overflowByPlacement: Record<string, SideObject> = {
    top: {top: 1, bottom: 0, left: 0, right: 0},
    bottom: {top: 0, bottom: 1000, left: 0, right: 0},
  };

  const {placement} = await computePosition(
    {},
    {},
    {
      placement: 'top',
      middleware: [flip()],
      platform: {
        getElementRects: () => ({
          reference: {x: 0, y: 0, width: 100, height: 100},
          floating: {x: 0, y: 0, width: 100, height: 300},
        }),
        getDimensions: () => ({width: 100, height: 300}),
        getClippingRect: () => ({x: 0, y: 0, width: 100, height: 100}),
        isRTL: () => Promise.resolve(false),
        detectOverflow: (state) =>
          Promise.resolve(
            overflowByPlacement[state.placement] ?? {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            },
          ),
      },
    },
  );

  expect(placement).toBe('top');
});

test('bestFit applies no start-side penalty when mainAxis checking is off', async () => {
  // With mainAxis: false, overflows[0] holds a cross-axis value, not the
  // main-axis overflow, so the start-side penalty must not apply: the
  // smaller total overflow wins even though the placement side is 'top'.
  const overflowByPlacement: Record<string, SideObject> = {
    top: {top: 0, bottom: 0, left: 200, right: 0},
    bottom: {top: 0, bottom: 0, left: 250, right: 0},
  };

  const {placement} = await computePosition(
    {},
    {},
    {
      placement: 'top',
      middleware: [flip({mainAxis: false})],
      platform: {
        getElementRects: () => ({
          reference: {x: 0, y: 0, width: 100, height: 100},
          floating: {x: 0, y: 0, width: 100, height: 300},
        }),
        getDimensions: () => ({width: 100, height: 300}),
        getClippingRect: () => ({x: 0, y: 0, width: 100, height: 100}),
        isRTL: () => Promise.resolve(false),
        detectOverflow: (state) =>
          Promise.resolve(
            overflowByPlacement[state.placement] ?? {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            },
          ),
      },
    },
  );

  expect(placement).toBe('top');
});

test('bestFit start-side penalty swaps left/right in RTL', async () => {
  const overflowByPlacement: Record<string, SideObject> = {
    // In RTL the start edge is the right one: overflowing right is clipped,
    // overflowing left can be scrolled into view.
    right: {top: 0, bottom: 0, left: 0, right: 200},
    left: {top: 0, bottom: 0, left: 250, right: 0},
  };

  const {placement} = await computePosition(
    {},
    {},
    {
      placement: 'right',
      middleware: [flip()],
      platform: {
        getElementRects: () => ({
          reference: {x: 0, y: 0, width: 100, height: 100},
          floating: {x: 0, y: 0, width: 300, height: 100},
        }),
        getDimensions: () => ({width: 300, height: 100}),
        getClippingRect: () => ({x: 0, y: 0, width: 100, height: 100}),
        isRTL: () => Promise.resolve(true),
        detectOverflow: (state) =>
          Promise.resolve(
            overflowByPlacement[state.placement] ?? {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            },
          ),
      },
    },
  );

  expect(placement).toBe('left');
});
