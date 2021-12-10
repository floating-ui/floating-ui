import type {Placement, Middleware, MiddlewareArguments} from '../types';
import {getOppositePlacement} from '../utils/getOppositePlacement';
import {getBasePlacement} from '../utils/getBasePlacement';
import {
  detectOverflow,
  Options as DetectOverflowOptions,
} from '../detectOverflow';
import {getAlignmentSides} from '../utils/getAlignmentSides';
import {getExpandedPlacements} from '../utils/getExpandedPlacements';

export type Options = {
  mainAxis: boolean;
  crossAxis: boolean;
  fallbackPlacements: Array<Placement>;
  fallbackStrategy: 'bestFit' | 'initialPlacement';
  flipAlignment: boolean;
};

export const flip = (
  options: Partial<Options & DetectOverflowOptions> = {}
): Middleware => ({
  name: 'flip',
  async fn(middlewareArguments: MiddlewareArguments) {
    const {placement, middlewareData, rects, initialPlacement} =
      middlewareArguments;

    if (middlewareData.flip?.skip) {
      return {};
    }

    const {
      mainAxis: checkMainAxis = true,
      crossAxis: checkCrossAxis = true,
      fallbackPlacements: specifiedFallbackPlacements,
      fallbackStrategy = 'bestFit',
      flipAlignment = true,
      ...detectOverflowOptions
    } = options;

    const basePlacement = getBasePlacement(placement);
    const isBasePlacement = basePlacement === initialPlacement;

    const fallbackPlacements =
      specifiedFallbackPlacements ||
      (isBasePlacement || !flipAlignment
        ? [getOppositePlacement(initialPlacement)]
        : getExpandedPlacements(initialPlacement));

    const placements = [initialPlacement, ...fallbackPlacements];

    const overflow = await detectOverflow(
      middlewareArguments,
      detectOverflowOptions
    );

    const overflows = [];
    let overflowsData = middlewareData.flip?.overflows || [];

    if (checkMainAxis) {
      overflows.push(overflow[basePlacement]);
    }

    if (checkCrossAxis) {
      const {main, cross} = getAlignmentSides(placement, rects);
      overflows.push(overflow[main], overflow[cross]);
    }

    overflowsData = [...overflowsData, {placement, overflows}];

    // One or more sides is overflowing
    if (!overflows.every((side) => side <= 0)) {
      const nextIndex = (middlewareData.flip?.index ?? 0) + 1;
      const nextPlacement = placements[nextIndex];

      if (nextPlacement) {
        // Try next placement and re-run the lifecycle
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

      let resetPlacement: Placement = 'bottom';
      switch (fallbackStrategy) {
        case 'bestFit': {
          const placement = overflowsData
            .slice()
            .sort(
              (a, b) =>
                a.overflows
                  .filter((overflow) => overflow > 0)
                  .reduce((acc, overflow) => acc + overflow, 0) -
                b.overflows
                  .filter((overflow) => overflow > 0)
                  .reduce((acc, overflow) => acc + overflow, 0)
            )[0]?.placement;
          if (placement) {
            resetPlacement = placement;
          }
          break;
        }
        case 'initialPlacement':
          resetPlacement = initialPlacement;
          break;
        default:
      }

      return {
        data: {
          skip: true,
        },
        reset: {
          placement: resetPlacement,
        },
      };
    }

    return {};
  },
});
