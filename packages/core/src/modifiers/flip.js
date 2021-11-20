// @flow
import type { Placement } from '../enums';
import type { Modifier, ModifierArguments } from '../types';
import getOppositePlacement from '../utils/getOppositePlacement';
import getBasePlacement from '../utils/getBasePlacement';
import detectOverflow, {
  type Options as DetectOverflowOptions,
} from '../utils/detectOverflow';
import getVariationSides from '../utils/getVariationSides';
import getExpandedPlacements from '../utils/getExpandedPlacements';

// eslint-disable-next-line import/no-unused-modules
export type Options = {
  mainAxis: boolean,
  altAxis: boolean,
  fallbackPlacements: Array<Placement>,
  flipVariations: boolean,
  ...DetectOverflowOptions,
};

export const flip = (options: Options = {}): Modifier => ({
  name: 'flip',
  async fn(modifierArguments: ModifierArguments) {
    const {
      placement,
      coords,
      modifiersData,
      rects,
      scheduleReset,
      initialPlacement,
    } = modifierArguments;

    if (modifiersData.flip?.skip) {
      return coords;
    }

    const {
      mainAxis: checkMainAxis = true,
      altAxis: checkAltAxis = true,
      fallbackPlacements: specifiedFallbackPlacements,
      flipVariations = true,
      ...detectOverflowOptions
    } = options;

    const basePlacement = getBasePlacement(placement);
    const isBasePlacement = basePlacement === initialPlacement;

    const fallbackPlacements =
      specifiedFallbackPlacements ||
      (isBasePlacement || !flipVariations
        ? [getOppositePlacement(initialPlacement)]
        : getExpandedPlacements(initialPlacement));

    const placements = [initialPlacement, ...fallbackPlacements];

    const overflow = await detectOverflow(
      modifierArguments,
      detectOverflowOptions
    );

    const overflows = [];
    const overflowsData = modifiersData.flip?.overflows || [];

    if (checkMainAxis) {
      overflows.push(overflow[basePlacement]);
    }

    if (checkAltAxis) {
      const { main, alt } = getVariationSides(placement, rects);
      overflows.push(overflow[main], overflow[alt]);
    }

    // One or more sides is overflowing
    if (!overflows.every((side) => side <= 0)) {
      const nextPlacement =
        placements[modifiersData.flip ? modifiersData.flip.index + 1 : 1];

      if (nextPlacement) {
        // Try next placement and re-run the lifecycle
        scheduleReset({ placement: nextPlacement });

        return {
          ...coords,
          data: {
            index: modifiersData.flip ? modifiersData.flip.index + 1 : 1,
            overflows: [...overflowsData, { placement, overflows }],
          },
        };
      }

      // No placements fit, fallback to the one that fits best
      const bestFittingPlacement = overflowsData
        .slice()
        .sort(
          (a, b) =>
            a.overflows
              .filter((overflow) => overflow > 0)
              .reduce((acc, overflow) => acc + overflow, 0) -
            b.overflows
              .filter((overflow) => overflow > 0)
              .reduce((acc, overflow) => acc + overflow, 0)
        )[0].placement;

      scheduleReset({ placement: bestFittingPlacement });

      return {
        ...coords,
        data: { skip: true },
      };
    }

    return coords;
  },
});
