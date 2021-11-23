// @flow
import type { Modifier, ModifierArguments } from '../types';
import {
  auto,
  basePlacements,
  placements as allPlacements,
  bottom,
  top,
  type Placement,
  type AutoPlacement,
  type Variation,
} from '../enums';
import detectOverflow, {
  type Options as DetectOverflowOptions,
} from '../utils/detectOverflow';
import getBasePlacement from '../utils/getBasePlacement';
import getVariation from '../utils/getVariation';
import getVariationSides from '../utils/getVariationSides';
import getOppositeVariationPlacement from '../utils/getOppositeVariationPlacement';

function convertAutoPlacementToComputedPlacements(
  placement: AutoPlacement,
  allowedPlacements: Array<Placement>
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

export type Options = {|
  variation: ?Variation,
  crossAxis: boolean,
  allowedPlacements: Array<Placement>,
  autoVariation: boolean,
  ...DetectOverflowOptions,
|};

export const autoPlacement = (options: $Shape<Options> = {}): Modifier => ({
  name: 'autoPlacement',
  async fn(modifierArguments: ModifierArguments) {
    const {
      x,
      y,
      initialPlacement,
      rects,
      scheduleReset,
      modifiersData,
      placement,
    } = modifierArguments;

    const {
      variation = null,
      crossAxis = true,
      allowedPlacements = allPlacements,
      autoVariation = true,
      ...detectOverflowOptions
    } = options;

    if (modifiersData.autoPlacement?.skip) {
      return {};
    }

    const autoPlacement: AutoPlacement = ('auto' +
      (variation != null ? `-${variation}` : ''): any);

    let placements = convertAutoPlacementToComputedPlacements(
      autoPlacement,
      allowedPlacements
    );

    if (autoVariation) {
      // $FlowFixMe[incompatible-type]
      placements = placements.reduce((acc, placement) => {
        return acc.concat(
          getVariation(placement)
            ? [placement, getOppositeVariationPlacement(placement)]
            : placement
        );
      }, []);
    }

    const overflow = await detectOverflow(
      modifierArguments,
      detectOverflowOptions
    );

    const currentIndex = modifiersData.autoPlacement?.index ?? 0;
    const currentPlacement = placements[currentIndex];
    const { main, alt } = getVariationSides(currentPlacement, rects);

    // Make `computeCoords` start from the right place
    if (placement !== currentPlacement) {
      scheduleReset({ placement: placements[0] });
      return { x, y };
    }

    const currentOverflows = [
      overflow[getBasePlacement(currentPlacement)],
      overflow[main],
      overflow[alt],
    ];

    const allOverflows = [
      ...(modifiersData.autoPlacement?.overflows ?? []),
      { placement: currentPlacement, overflows: currentOverflows },
    ];

    const nextPlacement = placements[currentIndex + 1];

    // There are more placements to check
    if (nextPlacement) {
      scheduleReset({ placement: nextPlacement });

      return {
        data: {
          index: currentIndex + 1,
          overflows: allOverflows,
        },
      };
    }

    const sortFn =
      crossAxis || (autoVariation && getVariation(placement))
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
      data: { skip: true },
    };
  },
});
