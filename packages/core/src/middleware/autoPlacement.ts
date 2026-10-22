import type {Alignment, Placement} from '@floating-ui/utils';
import {
  evaluate,
  getAlignment,
  getAlignmentSides,
  getOppositeAlignmentPlacement,
  getSide,
  placements as ALL_PLACEMENTS,
} from '@floating-ui/utils';

import type {DetectOverflowOptions} from '../detectOverflow';
import type {Derivable, Middleware} from '../types';

export function getPlacementList(
  alignment: Alignment | null,
  autoAlignment: boolean,
  allowedPlacements: Array<Placement>,
) {
  return alignment
    ? [
        ...allowedPlacements.filter(
          (placement) => getAlignment(placement) === alignment,
        ),
        ...(autoAlignment
          ? allowedPlacements.filter(
              (placement) =>
                getAlignment(placement) ===
                getOppositeAlignmentPlacement(alignment),
            )
          : []),
      ]
    : allowedPlacements.filter((placement) => getSide(placement) === placement);
}

export interface AutoPlacementOptions extends DetectOverflowOptions {
  /**
   * The axis that runs along the alignment of the floating element. Determines
   * whether to check for most space along this axis.
   * @default false
   */
  crossAxis?: boolean | undefined;
  /**
   * Choose placements with a particular alignment.
   * @default undefined
   */
  alignment?: Alignment | null | undefined;
  /**
   * Whether to choose placements with the opposite alignment if the preferred
   * alignment does not fit.
   * @default true
   */
  autoAlignment?: boolean | undefined;
  /**
   * Which placements are allowed to be chosen. Placements must be within the
   * `alignment` option if explicitly set.
   * @default allPlacements (variable)
   */
  allowedPlacements?: Array<Placement> | undefined;
}

/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
export const autoPlacement = (
  options: AutoPlacementOptions | Derivable<AutoPlacementOptions> = {},
): Middleware => ({
  name: 'autoPlacement',
  options,
  async fn(state) {
    const {rects, middlewareData, placement, platform, elements} = state;

    const {
      crossAxis = false,
      alignment,
      allowedPlacements = ALL_PLACEMENTS,
      autoAlignment = true,
      ...detectOverflowOptions
    } = evaluate(options, state);

    const placements =
      alignment !== undefined || allowedPlacements === ALL_PLACEMENTS
        ? getPlacementList(alignment || null, autoAlignment, allowedPlacements)
        : allowedPlacements;

    const currentIndex = middlewareData.autoPlacement?.index || 0;
    const currentPlacement = placements[currentIndex];

    if (currentPlacement == null) {
      return {};
    }

    // Make `computeCoords` start from the right place.
    if (placement !== currentPlacement) {
      return {
        reset: {
          placement: placements[0],
        },
      };
    }

    const overflow = await platform.detectOverflow(
      state,
      detectOverflowOptions,
    );

    const alignmentSides = getAlignmentSides(
      currentPlacement,
      rects,
      await platform.isRTL?.(elements.floating),
    );

    const currentOverflows = [
      overflow[getSide(currentPlacement)],
      overflow[alignmentSides[0]],
      overflow[alignmentSides[1]],
    ];

    const allOverflows = [
      ...(middlewareData.autoPlacement?.overflows || []),
      {placement: currentPlacement, overflows: currentOverflows},
    ];

    const nextPlacement = placements[currentIndex + 1];
    let resetPlacement = nextPlacement;

    if (!nextPlacement) {
      // Check along the mainAxis and main crossAxis side, or only the mainAxis.
      const getSpace = ({
        placement,
        overflows,
      }: (typeof allOverflows)[number]) =>
        getAlignment(placement) && crossAxis
          ? overflows[0] + overflows[1]
          : overflows[0];

      const placementsSortedByMostSpace = [...allOverflows].sort(
        (a, b) => getSpace(a) - getSpace(b),
      );

      resetPlacement = (
        placementsSortedByMostSpace.find((d) =>
          d.overflows
            // Aligned placements should not check their opposite crossAxis
            // side.
            .slice(0, getAlignment(d.placement) ? 2 : 3)
            .every((v) => v <= 0),
        ) || placementsSortedByMostSpace[0]
      ).placement;
    }

    if (nextPlacement || resetPlacement !== placement) {
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
