// @flow
import type { ComputedPlacement, AutoPlacement } from '../enums';
import type { Modifier, ModifierArguments } from '../types';
import { auto as autoEnum, basePlacements, computedPlacements } from '../enums';
import detectOverflow, {
  type Options as DetectOverflowOptions,
} from '../utils/detectOverflow';
import getBasePlacement from '../utils/getBasePlacement';
import getVariation from '../utils/getVariation';
import getVariationSides from '../utils/getVariationSides';
import getOppositeVariationPlacement from '../utils/getOppositeVariationPlacement';

function convertAutoPlacementToComputedPlacements(
  placement: AutoPlacement,
  allowedPlacements: Array<ComputedPlacement>
) {
  const variation = getVariation(placement);

  if (!variation) {
    return basePlacements.filter((placement) =>
      allowedPlacements.includes(placement)
    );
  }

  return allowedPlacements.filter(
    (placement) => getVariation(placement) === variation
  );
}

export type Options = {
  altAxis: boolean,
  allowedPlacements: Array<ComputedPlacement>,
  autoVariation: false,
  ...DetectOverflowOptions,
};

export const auto = (options: Options = {}): Modifier => ({
  name: 'auto',
  async fn(modifierArguments: ModifierArguments) {
    const {
      initialPlacement,
      coords,
      rects,
      scheduleReset,
      modifiersData,
      placement,
    } = modifierArguments;

    const {
      altAxis = true,
      allowedPlacements = computedPlacements,
      autoVariation = true,
      ...detectOverflowOptions
    } = options;

    if (
      modifiersData.auto?.skip ||
      getBasePlacement(initialPlacement) !== autoEnum
    ) {
      return coords;
    }

    let placements: any = convertAutoPlacementToComputedPlacements(
      // $FlowIgnore[incompatible-call] checked above
      initialPlacement,
      allowedPlacements
    );

    if (autoVariation) {
      placements = placements.reduce((acc, placement) => {
        return acc.concat(
          getVariation(placement)
            ? [placement, getOppositeVariationPlacement(placement)]
            : placement
        );
      }, []);
    }

    // Make `computeCoords` start from the right place
    if (getBasePlacement(placement) === autoEnum) {
      scheduleReset({ placement: placements[0] });
      return coords;
    }

    const overflow = await detectOverflow(
      modifierArguments,
      detectOverflowOptions
    );

    const currentIndex = modifiersData.auto?.index ?? 0;
    const currentPlacement = placements[currentIndex];
    const { main, alt } = getVariationSides(currentPlacement, rects);

    const currentOverflows = [
      overflow[getBasePlacement(currentPlacement)],
      overflow[main],
      overflow[alt],
    ];

    const allOverflows = [
      ...(modifiersData.auto?.overflows ?? []),
      { placement: currentPlacement, overflows: currentOverflows },
    ];

    const nextPlacement = placements[currentIndex + 1];

    // There are more placements to check
    if (nextPlacement) {
      scheduleReset({ placement: nextPlacement });

      return {
        ...coords,
        data: {
          index: currentIndex + 1,
          overflows: allOverflows,
        },
      };
    }

    const sortFn =
      altAxis || (autoVariation && getVariation(placement))
        ? (a, b) =>
            a.overflows
              .filter((overflow) => overflow > 0)
              .reduce((acc, overflow) => acc + overflow, 0) -
            b.overflows
              .filter((overflow) => overflow > 0)
              .reduce((acc, overflow) => acc + overflow, 0)
        : (a, b) => a.overflows[0] - b.overflows[0];

    const placementsSortedByLeastOverflow = allOverflows.slice().sort(sortFn);
    const placementThatFitsOnAllSides = placementsSortedByLeastOverflow.find(
      ({ overflows }) => overflows.every((overflow) => overflow <= 0)
    )?.placement;

    scheduleReset({
      placement:
        placementThatFitsOnAllSides ??
        placementsSortedByLeastOverflow[0].placement,
    });

    return {
      ...coords,
      data: { skip: true },
    };
  },
});
