import type {
  Middleware,
  MiddlewareArguments,
  Placement,
  Alignment,
} from '../types';
import {
  detectOverflow,
  Options as DetectOverflowOptions,
} from '../detectOverflow';
import {getBasePlacement} from '../utils/getBasePlacement';
import {getAlignment} from '../utils/getAlignment';
import {getAlignmentSides} from '../utils/getAlignmentSides';
import {getOppositeAlignmentPlacement} from '../utils/getOppositeAlignmentPlacement';
import {allPlacements} from '../enums';

export function getPlacementList(
  alignment: Alignment | null,
  autoAlignment: boolean,
  allowedPlacements: Array<Placement>
) {
  return allowedPlacements.filter((placement) => {
    if (alignment) {
      return (
        getAlignment(placement) === alignment ||
        (autoAlignment
          ? getOppositeAlignmentPlacement(placement) !== placement
          : false)
      );
    }

    return getBasePlacement(placement) === placement;
  });
}

export type Options = {
  alignment: Alignment | null;
  crossAxis: boolean;
  allowedPlacements: Array<Placement>;
  autoAlignment: boolean;
};

export const autoPlacement = (
  options: Partial<Options & DetectOverflowOptions> = {}
): Middleware => ({
  name: 'autoPlacement',
  async fn(middlewareArguments: MiddlewareArguments) {
    const {x, y, rects, middlewareData, placement} = middlewareArguments;

    const {
      alignment = null,
      crossAxis = false,
      allowedPlacements = allPlacements,
      autoAlignment = true,
      ...detectOverflowOptions
    } = options;

    if (middlewareData.autoPlacement?.skip) {
      return {};
    }

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
    const {main, cross} = getAlignmentSides(currentPlacement, rects);

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
      overflow[getBasePlacement(currentPlacement)],
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
      .sort(
        crossAxis || (autoAlignment && getAlignment(placement))
          ? (a, b) =>
              a.overflows.reduce((acc, overflow) => acc + overflow, 0) -
              b.overflows.reduce((acc, overflow) => acc + overflow, 0)
          : (a, b) => a.overflows[0] - b.overflows[0]
      );
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
