import {computePosition} from '../../src';
import {flip} from '../../src/middleware/flip';
import type {Platform} from '../../src/types';

// Builds a platform whose `detectOverflow` returns a fixed overflow object per
// placement, so the `flip` algorithm can be exercised deterministically without
// a real DOM. Any side not specified is treated as fitting (negative overflow).
function createPlatform(
  overflowByPlacement: Record<string, Partial<Record<string, number>>>,
): Platform {
  return {
    getElementRects: () =>
      Promise.resolve({
        reference: {x: 0, y: 0, width: 100, height: 20},
        floating: {x: 0, y: 0, width: 80, height: 200},
      }),
    getDimensions: () => Promise.resolve({width: 80, height: 200}),
    getClippingRect: () =>
      Promise.resolve({x: 0, y: 0, width: 100, height: 100}),
    detectOverflow: (state: any) => {
      const sides = overflowByPlacement[state.placement as string] || {};
      return Promise.resolve({
        top: sides.top ?? -50,
        right: sides.right ?? -50,
        bottom: sides.bottom ?? -50,
        left: sides.left ?? -50,
      });
    },
  } as unknown as Platform;
}

describe('flip fallbackStrategy "bestFit"', () => {
  // https://github.com/floating-ui/floating-ui/issues/3014
  // When the floating element cannot fit on either the preferred side or its
  // opposite and both overflow by the same amount, `bestFit` should prefer the
  // placement that overflows toward the scrollable direction (`bottom`) over the
  // one that overflows toward the clipped/inaccessible origin direction (`top`).
  test('prefers scrollable (bottom) over clipped (top) overflow on a y-axis tie', async () => {
    const platform = createPlatform({
      top: {top: 150},
      bottom: {bottom: 150},
    });

    const {placement} = await computePosition(
      {},
      {},
      {
        placement: 'top',
        middleware: [flip()],
        platform,
      },
    );

    expect(placement).toBe('bottom');
  });

  test('prefers scrollable (right) over clipped (left) overflow on an x-axis tie', async () => {
    const platform = createPlatform({
      left: {left: 150},
      right: {right: 150},
    });

    const {placement} = await computePosition(
      {},
      {},
      {
        placement: 'left',
        middleware: [flip()],
        platform,
      },
    );

    expect(placement).toBe('right');
  });

  test('still chooses the least-overflowing placement when overflows differ', async () => {
    // `top` overflows much less than `bottom`; even though `top` is the clipped
    // side, it remains the better fit and must still be selected.
    const platform = createPlatform({
      top: {top: 10},
      bottom: {bottom: 150},
    });

    const {placement} = await computePosition(
      {},
      {},
      {
        placement: 'top',
        middleware: [flip()],
        platform,
      },
    );

    expect(placement).toBe('top');
  });
});
