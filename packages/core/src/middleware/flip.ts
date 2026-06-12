import type {Placement} from '@floating-ui/utils';
import {
  evaluate,
  getAlignmentSides,
  getExpandedPlacements,
  getOppositeAxisPlacements,
  getOppositePlacement,
  getSide,
  getSideAxis,
} from '@floating-ui/utils';

import type {DetectOverflowOptions} from '../detectOverflow';
import type {Derivable, Middleware} from '../types';

export interface FlipOptions extends DetectOverflowOptions {
  /**
   * The axis that runs along the side of the floating element. Determines
   * whether overflow along this axis is checked to perform a flip.
   * @default true
   */
  mainAxis?: boolean;
  /**
   * The axis that runs along the alignment of the floating element. Determines
   * whether overflow along this axis is checked to perform a flip.
   * - `true`: Whether to check cross axis overflow for both side and alignment flipping.
   * - `false`: Whether to disable all cross axis overflow checking.
   * - `'alignment'`: Whether to check cross axis overflow for alignment flipping only.
   * @default true
   */
  crossAxis?: boolean | 'alignment';
  /**
   * Placements to try sequentially if the preferred `placement` does not fit.
   * @default [oppositePlacement] (computed)
   */
  fallbackPlacements?: Array<Placement>;
  /**
   * What strategy to use when no placements fit.
   * @default 'bestFit'
   */
  fallbackStrategy?: 'bestFit' | 'initialPlacement';
  /**
   * Whether to allow fallback to the perpendicular axis of the preferred
   * placement, and if so, which side direction along the axis to prefer.
   * @default 'none' (disallow fallback)
   */
  fallbackAxisSideDirection?: 'none' | 'start' | 'end';
  /**
   * Whether to flip to placements with the opposite alignment if they fit
   * better.
   * @default true
   */
  flipAlignment?: boolean;
}

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
export const flip = (
  options: FlipOptions | Derivable<FlipOptions> = {},
): Middleware => ({
  name: 'flip',
  options,
  async fn(state) {
    const {
      placement,
      middlewareData,
      rects,
      initialPlacement,
      platform,
      elements,
    } = state;

    const {
      mainAxis: checkMainAxis = true,
      crossAxis: checkCrossAxis = true,
      fallbackPlacements: specifiedFallbackPlacements,
      fallbackStrategy = 'bestFit',
      fallbackAxisSideDirection = 'none',
      flipAlignment = true,
      ...detectOverflowOptions
    } = evaluate(options, state);

    // If a reset by the arrow was caused due to an alignment offset being
    // added, we should skip any logic now since `flip()` has already done its
    // work.
    // https://github.com/floating-ui/floating-ui/issues/2549#issuecomment-1719601643
    if (middlewareData.arrow?.alignmentOffset) {
      return {};
    }

    const side = getSide(placement);
    const initialSideAxis = getSideAxis(initialPlacement);
    const isBasePlacement = getSide(initialPlacement) === initialPlacement;
    const rtl = await platform.isRTL?.(elements.floating);

    const fallbackPlacements =
      specifiedFallbackPlacements ||
      (isBasePlacement || !flipAlignment
        ? [getOppositePlacement(initialPlacement)]
        : getExpandedPlacements(initialPlacement));

    const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== 'none';

    if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
      fallbackPlacements.push(
        ...getOppositeAxisPlacements(
          initialPlacement,
          flipAlignment,
          fallbackAxisSideDirection,
          rtl,
        ),
      );
    }

    const placements = [initialPlacement, ...fallbackPlacements];

    // Overflow toward these sides displaces the floating element behind the
    // clipping boundary's scroll origin, where it can't be scrolled into
    // view, while overflow toward the opposite sides remains reachable by
    // scrolling. In RTL, the horizontal scroll origin is the right side.
    // https://github.com/floating-ui/floating-ui/issues/3014
    const clippedSide = rtl ? 'right' : 'left';

    const getBestFitPlacement = (
      overflowsData: Array<{placement: Placement; overflows: Array<number>}>,
      preferReachableSide: boolean,
    ) =>
      overflowsData
        .filter((d) => {
          if (hasFallbackAxisSideDirection) {
            const currentSideAxis = getSideAxis(d.placement);
            return (
              currentSideAxis === initialSideAxis ||
              // Create a bias to the `y` side axis due to horizontal
              // reading directions favoring greater width.
              currentSideAxis === 'y'
            );
          }
          return true;
        })
        .map((d) => {
          const side = getSide(d.placement);

          return [
            d.placement,
            // Whether the placement's main axis side overflows toward the
            // clipped scroll origin, making the overflowing portion
            // unreachable.
            preferReachableSide &&
              checkMainAxis &&
              d.overflows[0] > 0 &&
              (side === 'top' || side === clippedSide),
            d.overflows
              .filter((overflow) => overflow > 0)
              .reduce((acc, overflow) => acc + overflow, 0),
          ] as const;
        })
        .sort((a, b) => Number(a[1]) - Number(b[1]) || a[2] - b[2])[0]?.[0];

    const getMainAxisDimension = (p: Placement) =>
      rects.floating[getSideAxis(p) === 'y' ? 'height' : 'width'];

    const fallbackDimension = middlewareData.flip?.fallbackDimension;
    // Whether `size()` has shrunk the floating element on the fallback
    // placement's overflowing axis since the placement was chosen. The
    // overflow is then recoverable by resizing, so clipping toward the
    // scroll origin no longer matters and the best-fitting placement should
    // win with no bias toward the scrollable direction.
    const sizeShrankFallback =
      fallbackDimension !== undefined &&
      middlewareData.size != null &&
      getMainAxisDimension(placement) < fallbackDimension;

    if (sizeShrankFallback) {
      const neutralPlacement = getBestFitPlacement(
        middlewareData.flip?.overflows || [],
        false,
      );
      if (neutralPlacement && neutralPlacement !== placement) {
        return {
          reset: {
            placement: neutralPlacement,
          },
        };
      }
    }

    const overflow = await platform.detectOverflow(
      state,
      detectOverflowOptions,
    );

    const overflows = [];
    let overflowsData = middlewareData.flip?.overflows || [];

    if (checkMainAxis) {
      overflows.push(overflow[side]);
    }

    if (checkCrossAxis) {
      const sides = getAlignmentSides(placement, rects, rtl);
      overflows.push(overflow[sides[0]], overflow[sides[1]]);
    }

    overflowsData = [...overflowsData, {placement, overflows}];

    // One or more sides is overflowing.
    if (!overflows.every((side) => side <= 0)) {
      const nextIndex = (middlewareData.flip?.index || 0) + 1;
      const nextPlacement = placements[nextIndex];

      if (nextPlacement) {
        const ignoreCrossAxisOverflow =
          checkCrossAxis === 'alignment'
            ? initialSideAxis !== getSideAxis(nextPlacement)
            : false;

        if (
          !ignoreCrossAxisOverflow ||
          // We leave the current main axis only if every placement on that axis
          // overflows the main axis.
          overflowsData.every((d) =>
            getSideAxis(d.placement) === initialSideAxis
              ? d.overflows[0] > 0
              : true,
          )
        ) {
          // Try next placement and re-run the lifecycle.
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData,
            },
            reset: {
              placement: nextPlacement,
            },
          };
        }
      }

      // First, find the candidates that fit on the mainAxis side of overflow,
      // then find the placement that fits the best on the main crossAxis side.
      let resetPlacement = overflowsData
        .filter((d) => d.overflows[0] <= 0)
        .sort((a, b) => a.overflows[1] - b.overflows[1])[0]?.placement;
      let fallbackData;

      // Otherwise fallback.
      if (!resetPlacement) {
        switch (fallbackStrategy) {
          case 'bestFit': {
            const bestFitPlacement = getBestFitPlacement(
              overflowsData,
              !sizeShrankFallback,
            );
            if (bestFitPlacement) {
              resetPlacement = bestFitPlacement;
              // Persist the overflow data and the pre-resize main-axis
              // dimension so the placement can be re-resolved neutrally if
              // `size()` shrinks the floating element afterward.
              fallbackData = {
                overflows: overflowsData,
                fallbackDimension:
                  fallbackDimension ?? getMainAxisDimension(bestFitPlacement),
              };
            }
            break;
          }
          case 'initialPlacement':
            resetPlacement = initialPlacement;
            break;
          default:
        }
      }

      if (placement !== resetPlacement) {
        return {
          data: fallbackData,
          reset: {
            placement: resetPlacement,
          },
        };
      }

      if (fallbackData) {
        return {
          data: fallbackData,
        };
      }
    }

    return {};
  },
});
