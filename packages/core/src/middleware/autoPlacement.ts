import type {Middleware, Placement, Alignment} from '../types';
import {
  detectOverflow,
  Options as DetectOverflowOptions,
} from '../detectOverflow';
import {getSide} from '../utils/getSide';
import {getAlignment} from '../utils/getAlignment';
import {getAlignmentSides} from '../utils/getAlignmentSides';
import {getOppositeAlignmentPlacement} from '../utils/getOppositeAlignmentPlacement';
import {allPlacements} from '../enums';

export function getPlacementList(
  alignment: Alignment | null,
  autoAlignment: boolean,
  allowedPlacements: Array<Placement>
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
    : allowedPlacements.filter((placement) => getSide(placement) === placement);

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

export interface Options {
  /**
   * Choose placements with a particular alignment.
   * @default null
   */
  alignment: Alignment | null;
  /**
   * Which placements are allowed to be chosen. Placements must be within the
   * `alignment` option set.
   * @default allPlacements (variable)
   */
  allowedPlacements: Array<Placement>;
  /**
   * Whether to choose placements with the opposite alignment if they will fit
   * better.
   * @default true
   */
  autoAlignment: boolean;
}

/**
 * Automatically chooses the `placement` which has the most space available.
 * @see https://floating-ui.com/docs/autoPlacement
 */
export const autoPlacement = (
  options: Partial<Options & DetectOverflowOptions> = {}
): Middleware => ({
  name: 'autoPlacement',
  options,
  async fn(middlewareArguments) {
    const {x, y, rects, middlewareData, placement, platform, elements} =
      middlewareArguments;

    const {
      alignment = null,
      allowedPlacements = allPlacements,
      autoAlignment = true,
      ...detectOverflowOptions
    } = options;

    const placements = getPlacementList(
      alignment,
      autoAlignment,
      allowedPlacements
    );

    const overflow = await detectOverflow(
      middlewareArguments,
      detectOverflowOptions
    );

    const currentIndex = middlewareData.autoPlacement?.index ?? 0;
    const currentPlacement = placements[currentIndex];

    if (currentPlacement == null) {
      return {};
    }

    const {main, cross} = getAlignmentSides(
      currentPlacement,
      rects,
      await platform.isRTL?.(elements.floating)
    );

    // Make `computeCoords` start from the right place
    if (placement !== currentPlacement) {
      return {
        x,
        y,
        reset: {
          placement: placements[0],
        },
      };
    }

    const currentOverflows = [
      overflow[getSide(currentPlacement)],
      overflow[main],
      overflow[cross],
    ];

    const allOverflows = [
      ...(middlewareData.autoPlacement?.overflows ?? []),
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
        },
      };
    }

    const placementsSortedByLeastOverflow = allOverflows
      .slice()
      .sort((a, b) => a.overflows[0] - b.overflows[0]);
    const placementThatFitsOnAllSides = placementsSortedByLeastOverflow.find(
      ({overflows}) => overflows.every((overflow) => overflow <= 0)
    )?.placement;

    const resetPlacement =
      placementThatFitsOnAllSides ??
      placementsSortedByLeastOverflow[0].placement;

    if (resetPlacement !== placement) {
      return {
        data: {
          index: currentIndex + 1,
          overflows: allOverflows,
        },
        reset: {
          placement: resetPlacement,
        },
      };
    }

    return {};
  },
});
