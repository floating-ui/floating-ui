import type {
  Placement,
  Middleware,
  MiddlewareArguments,
  Alignment,
  MiddlewareReturn,
} from '../types';
import {getOppositePlacement} from '../utils/getOppositePlacement';
import {getBasePlacement} from '../utils/getBasePlacement';
import {
  detectOverflow,
  Options as DetectOverflowOptions,
} from '../detectOverflow';
import {getAlignmentSides} from '../utils/getAlignmentSides';
import {getExpandedPlacements} from '../utils/getExpandedPlacements';
import {allPlacements} from '../enums';
import {getAlignment} from '../utils/getAlignment';
import {getOppositeAlignmentPlacement} from '../utils/getOppositeAlignmentPlacement';

export type FallbackOptions = {
  /**
   * The axis that runs along the side of the floating element.
   */
  mainAxis: boolean;
  /**
   * The axis that runs along the alignment of the floating element.
   */
  crossAxis: boolean;
  /**
   * Placements to try if the preferred `placement` does not fit.
   */
  placements: Array<Placement>;
  /**
   * What strategy to use when no placements fit.
   */
  noneFitStrategy: 'bestFit' | 'initialPlacement';
  /**
   * Whether to automatically also fallback to placements that have the
   * opposite alignment.
   */
  autoAlignment: boolean;
};

export const fallback = (options: Partial<FallbackOptions> = {}) => ({
  options,
  async fn(
    middlewareArguments: MiddlewareArguments,
    adaptiveOptions: Partial<Options & DetectOverflowOptions>
  ): Promise<MiddlewareReturn> {
    const {placement, initialPlacement, middlewareData, rects} =
      middlewareArguments;

    const {
      mainAxis: checkMainAxis = true,
      crossAxis: checkCrossAxis = true,
      placements: specifiedFallbackPlacements,
      noneFitStrategy = 'bestFit',
      autoAlignment = true,
    } = options;

    const basePlacement = getBasePlacement(placement);
    const isBasePlacement = basePlacement === initialPlacement;

    const fallbackPlacements =
      specifiedFallbackPlacements ||
      (isBasePlacement || !autoAlignment
        ? [getOppositePlacement(initialPlacement)]
        : getExpandedPlacements(initialPlacement));

    const placements = [initialPlacement, ...fallbackPlacements];

    const overflow = await detectOverflow(middlewareArguments, adaptiveOptions);

    const overflows = [];
    let overflowsData = middlewareData.adaptivePlacement?.overflows || [];

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
      const nextIndex = (middlewareData.adaptivePlacement?.index ?? 0) + 1;
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
            skip: false,
          },
        };
      }

      let resetPlacement = placement;
      switch (noneFitStrategy) {
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

      if (placement !== resetPlacement) {
        return {
          reset: {
            placement: resetPlacement,
          },
        };
      }
    }

    return {};
  },
});

export function getPlacementList(
  alignment: BestFitOptions['alignment'],
  autoAlignment: BestFitOptions['autoAlignment'],
  allowedPlacements: BestFitOptions['allowedPlacements']
) {
  const allowedPlacementsSortedByAlignment = alignment
    ? [
        ...allowedPlacements.filter(
          (placement) => getAlignment(placement) === alignment
        ),
        ...allowedPlacements.filter(
          (placement) => getAlignment(placement) !== alignment
        ),
      ]
    : allowedPlacements.filter(
        (placement) => getBasePlacement(placement) === placement
      );

  return allowedPlacementsSortedByAlignment.filter((placement) => {
    if (alignment) {
      return (
        getAlignment(placement) === alignment ||
        (autoAlignment
          ? getOppositeAlignmentPlacement(placement) !== placement
          : false)
      );
    }

    return true;
  });
}

export type BestFitOptions = {
  /**
   * Choose placements with a particular alignment.
   */
  alignment: Alignment | null;
  /**
   * Which placements are allowed to be chosen. Placements must be within the
   * `alignment` option set.
   */
  allowedPlacements: Array<Placement>;
  /**
   * Whether to choose placements with the opposite alignment if they will fit
   * better.
   */
  autoAlignment: boolean;
};

export const bestFit = (options: Partial<BestFitOptions> = {}) => ({
  options,
  async fn(
    middlewareArguments: MiddlewareArguments,
    adaptiveOptions: Partial<Options & DetectOverflowOptions>
  ): Promise<MiddlewareReturn> {
    const {x, y, rects, middlewareData, placement} = middlewareArguments;

    const {
      alignment = null,
      allowedPlacements = allPlacements,
      autoAlignment = true,
    } = options;

    const placements = getPlacementList(
      alignment,
      autoAlignment,
      allowedPlacements
    );

    const overflow = await detectOverflow(middlewareArguments, adaptiveOptions);

    const currentIndex = middlewareData.adaptivePlacement?.index ?? 0;
    const currentPlacement = placements[currentIndex];
    const {main, cross} = getAlignmentSides(currentPlacement, rects);

    // Make `computeCoords` start from the right place
    if (placement !== currentPlacement) {
      return {
        x,
        y,
        reset: {
          placement: placements[0],
          skip: false,
        },
      };
    }

    const currentOverflows = [
      overflow[getBasePlacement(currentPlacement)],
      overflow[main],
      overflow[cross],
    ];

    const allOverflows = [
      ...(middlewareData.adaptivePlacement?.overflows ?? []),
      {placement: currentPlacement, overflows: currentOverflows},
    ];

    const nextPlacement = placements[currentIndex + 1];

    // There are more placements to check
    if (nextPlacement) {
      return {
        data: {
          index: currentIndex + 1,
          overflows: allOverflows,
        },
        reset: {
          placement: nextPlacement,
          skip: false,
        },
      };
    }

    const placementsSortedByLeastOverflow = allOverflows
      .slice()
      .sort((a, b) => a.overflows[0] - b.overflows[0]);
    const placementThatFitsOnAllSides = placementsSortedByLeastOverflow.find(
      ({overflows}) => overflows.every((overflow) => overflow <= 0)
    )?.placement;

    return {
      data: {
        skip: true,
      },
      reset: {
        placement:
          placementThatFitsOnAllSides ??
          placementsSortedByLeastOverflow[0].placement,
      },
    };
  },
});

export type Options = {
  /**
   * The axis that runs along the side of the floating element.
   */
  strategy: {
    fn(
      middlewareArguments: MiddlewareArguments,
      options: Partial<Options & DetectOverflowOptions>
    ): Promise<MiddlewareReturn>;
    options?: any;
  };
};

/**
 * Changes the placement of the floating element to one that will fit if the
 * initially specified `placement` does not.
 */
export const adaptivePlacement = (
  options: Partial<Options & DetectOverflowOptions> = {}
): Middleware => ({
  name: 'adaptivePlacement',
  options,
  async fn(middlewareArguments) {
    const {strategy} = options;
    return (await strategy?.fn(middlewareArguments, options)) ?? {};
  },
});
