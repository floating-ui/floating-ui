import {computePosition} from '../../src';
import {flip} from '../../src/middleware/flip';
import {size} from '../../src/middleware/size';
import type {Platform} from '../../src/types';

// Builds a platform whose `detectOverflow` returns a fixed overflow object per
// placement, so the `flip` algorithm can be exercised deterministically without
// a real DOM. Any side not specified is treated as fitting (negative overflow).
function createPlatform(
  overflowByPlacement: Record<string, Partial<Record<string, number>>>,
  {rtl = false}: {rtl?: boolean} = {},
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
    isRTL: () => Promise.resolve(rtl),
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
  // When the floating element can't fit on either the preferred side or its
  // opposite, `bestFit` should prefer the placement that overflows toward the
  // scrollable direction (`bottom`) over the one that overflows toward the
  // clipped/inaccessible origin direction (`top`), even when the clipped side
  // overflows less.
  test('prefers scrollable (bottom) over clipped (top) overflow on the y-axis', async () => {
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

    expect(placement).toBe('bottom');
  });

  test('remains on the scrollable (bottom) placement when it is the preferred one', async () => {
    const platform = createPlatform({
      top: {top: 10},
      bottom: {bottom: 150},
    });

    const {placement} = await computePosition(
      {},
      {},
      {
        placement: 'bottom',
        middleware: [flip()],
        platform,
      },
    );

    expect(placement).toBe('bottom');
  });

  test('prefers scrollable (right) over clipped (left) overflow on the x-axis', async () => {
    const platform = createPlatform({
      left: {left: 10},
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

  test('prefers scrollable (left) over clipped (right) overflow on the x-axis in RTL', async () => {
    const platform = createPlatform(
      {
        left: {left: 150},
        right: {right: 10},
      },
      {rtl: true},
    );

    const {placement} = await computePosition(
      {},
      {},
      {
        placement: 'right',
        middleware: [flip()],
        platform,
      },
    );

    expect(placement).toBe('left');
  });

  test('chooses the least-overflowing placement among scrollable candidates', async () => {
    const platform = createPlatform({
      top: {top: 200},
      bottom: {bottom: 150},
      right: {right: 100},
    });

    const {placement} = await computePosition(
      {},
      {},
      {
        placement: 'top',
        middleware: [flip({fallbackPlacements: ['bottom', 'right']})],
        platform,
      },
    );

    expect(placement).toBe('right');
  });

  test('does not bias toward the scrollable direction when `mainAxis` is false', async () => {
    // With `mainAxis: false`, only cross axis overflow is checked, so the
    // direction of main axis overflow can't be determined.
    const platform = createPlatform({
      top: {left: 10},
      bottom: {left: 150},
    });

    const {placement} = await computePosition(
      {},
      {},
      {
        placement: 'top',
        middleware: [flip({mainAxis: false})],
        platform,
      },
    );

    expect(placement).toBe('top');
  });

  describe('with `size()`', () => {
    // When `size()` constrains the floating element, it can be made to fit
    // (becoming scrollable itself), so clipping toward the scroll origin is
    // recoverable: the best-fitting placement should win with no bias toward
    // the scrollable direction.
    function createSizePlatform(
      overflowByPlacement: Record<string, Partial<Record<string, number>>>,
    ) {
      const dimensions = {width: 80, height: 200};
      return {
        getElementRects: () =>
          Promise.resolve({
            reference: {x: 0, y: 0, width: 100, height: 20},
            floating: {x: 0, y: 0, ...dimensions},
          }),
        getDimensions: () => Promise.resolve({...dimensions}),
        setDimensions: ({width, height}: {width: number; height: number}) => {
          dimensions.width = width;
          dimensions.height = height;
        },
        detectOverflow: (state: any) => {
          const sides = overflowByPlacement[state.placement as string] || {};
          // The fixed overflow values describe the floating element at its
          // initial 200px height; shrinking it reduces the y-axis overflow
          // equally.
          const shrunkBy = 200 - state.rects.floating.height;
          return Promise.resolve({
            top: (sides.top ?? -50) - shrunkBy,
            right: sides.right ?? -50,
            bottom: (sides.bottom ?? -50) - shrunkBy,
            left: sides.left ?? -50,
          });
        },
      } as unknown as Platform & {
        setDimensions: (dimensions: {width: number; height: number}) => void;
      };
    }

    test('chooses the least-overflowing placement with no scrollable bias', async () => {
      const platform = createSizePlatform({
        top: {top: 10},
        bottom: {bottom: 150},
      });

      const {placement} = await computePosition(
        {},
        {},
        {
          placement: 'top',
          middleware: [
            flip(),
            size({
              apply({availableHeight}) {
                platform.setDimensions({
                  width: 80,
                  height: Math.min(200, Math.max(availableHeight, 0)),
                });
              },
            }),
          ],
          platform,
        },
      );

      expect(placement).toBe('top');
    });

    test('keeps the scrollable bias when `size()` does not shrink the overflowing axis', async () => {
      const platform = createSizePlatform({
        top: {top: 10},
        bottom: {bottom: 150},
      });

      const {placement} = await computePosition(
        {},
        {},
        {
          placement: 'top',
          middleware: [
            flip(),
            size({
              apply() {
                // Only the cross axis (width) is constrained; the y-axis
                // overflow remains unrecoverable by resizing, so the bias
                // toward the scrollable direction must be kept.
                platform.setDimensions({width: 60, height: 200});
              },
            }),
          ],
          platform,
        },
      );

      expect(placement).toBe('bottom');
    });
  });
});
