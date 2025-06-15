import {
  evaluate,
  getAlign,
  getAlignSides,
  getSide,
  placements as ALL_PLACEMENTS,
  type Align,
  type Placement,
} from '../utils';
import type {DetectOverflowOptions} from '../detectOverflow';
import {detectOverflow} from '../detectOverflow';
import type {
  Derivable,
  Middleware,
  MiddlewareState,
  MiddlewareReturn,
} from '../types';

export function getPlacementList(
  align: Align,
  autoAlign: boolean,
  allowedPlacements: readonly Placement[],
): Placement[] {
  return align === 'center'
    ? allowedPlacements.filter((p) => p.align === 'center')
    : [
        ...allowedPlacements.filter((p) => p.align === align),
        ...(autoAlign
          ? allowedPlacements.filter((p) => {
              return p.align !== align && p.align !== 'center';
            })
          : []),
      ];
}

export interface AutoPlacementOptions extends DetectOverflowOptions {
  /**
   * The axis that runs along the align of the floating element. Determines
   * whether to check for most space along this axis.
   * @default false
   */
  crossAxis?: boolean;
  /**
   * Choose placements with a particular align.
   * @default 'center'
   */
  align?: Align;
  /**
   * Whether to choose placements with the opposite align if the preferred
   * align does not fit.
   * @default true
   */
  autoAlign?: boolean;
  /**
   * Which placements are allowed to be chosen. Placements must be within the
   * `align` option if explicitly set.
   * @default allPlacements (variable)
   */
  allowedPlacements?: Array<Placement>;
}

export function* autoPlacementGen(
  state: MiddlewareState,
  options: AutoPlacementOptions | Derivable<AutoPlacementOptions> = {},
): Generator<any, MiddlewareReturn, any> {
  const {rects, middlewareData, platform, elements} = state;

  const {
    crossAxis = false,
    align = 'center',
    allowedPlacements = ALL_PLACEMENTS,
    autoAlign = true,
    ...detectOverflowOptions
  } = evaluate(options, state);

  const placements =
    align !== 'center' || allowedPlacements === ALL_PLACEMENTS
      ? getPlacementList(align, autoAlign, allowedPlacements)
      : allowedPlacements;

  const overflow = yield* detectOverflow(state, detectOverflowOptions);

  const currentIndex = middlewareData.autoPlacement?.index || 0;
  const currentPlacement = placements[currentIndex];

  if (currentPlacement == null) {
    return {};
  }

  const rtl = yield platform.isRTL?.(elements.floating);
  const alignSides = getAlignSides(currentPlacement, rects, rtl);

  // Make `computeCoords` start from the right place.
  if (
    state.side !== currentPlacement.side ||
    state.align !== currentPlacement.align
  ) {
    return {
      reset: {
        side: placements[0].side,
        align: placements[0].align,
      },
    };
  }

  const currentOverflows = [
    overflow[getSide(currentPlacement)],
    overflow[alignSides[0]],
    overflow[alignSides[1]],
  ];

  const allOverflows = [
    ...(middlewareData.autoPlacement?.overflows || []),
    {placement: currentPlacement, overflows: currentOverflows},
  ];

  const nextPlacement = placements[currentIndex + 1];

  // There are more placements to check.
  if (nextPlacement) {
    return {
      data: {
        index: currentIndex + 1,
        overflows: allOverflows,
      },
      reset: {
        side: nextPlacement.side,
        align: nextPlacement.align,
      },
    };
  }

  const placementsSortedByMostSpace = allOverflows
    .map((d) => {
      const align = getAlign(d.placement);
      return [
        d.placement,
        align && crossAxis
          ? // Check along the mainAxis and main crossAxis side.
            d.overflows.slice(0, 2).reduce((acc, v) => acc + v, 0)
          : // Check only the mainAxis.
            d.overflows[0],
        d.overflows,
      ] as const;
    })
    .sort((a, b) => a[1] - b[1]);

  const placementsThatFitOnEachSide = placementsSortedByMostSpace.filter((d) =>
    d[2]
      .slice(
        0,
        // Aligned placements should not check their opposite crossAxis
        // side.
        getAlign(d[0]) ? 2 : 3,
      )
      .every((v) => v <= 0),
  );

  const resetPlacement =
    placementsThatFitOnEachSide[0]?.[0] || placementsSortedByMostSpace[0][0];

  if (
    resetPlacement.side !== state.side ||
    resetPlacement.align !== state.align
  ) {
    return {
      data: {
        index: currentIndex + 1,
        overflows: allOverflows,
      },
      reset: {
        side: resetPlacement.side,
        align: resetPlacement.align,
      },
    };
  }

  return {};
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
  fn(state) {
    return autoPlacementGen(state, options);
  },
});
