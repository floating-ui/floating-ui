// @flow
import type {
  PositioningStrategy,
  Offsets,
  Modifier,
  ModifierArguments,
  Rect,
  Window,
} from '../types';
import {
  type BasePlacement,
  type Variation,
  top,
  left,
  right,
  bottom,
  end,
} from '../enums';
import getOffsetParent from '../dom-utils/getOffsetParent';
import getWindow from '../dom-utils/getWindow';
import getDocumentElement from '../dom-utils/getDocumentElement';
import getComputedStyle from '../dom-utils/getComputedStyle';
import getBasePlacement from '../utils/getBasePlacement';
import getVariation from '../utils/getVariation';
import { round } from '../utils/math';

// eslint-disable-next-line import/no-unused-modules
export type RoundOffsets = (
  offsets: $Shape<{ x: number, y: number, centerOffset: number }>
) => Offsets;

// eslint-disable-next-line import/no-unused-modules
export type Options = {
  gpuAcceleration: boolean,
  adaptive: boolean,
  roundOffsets?: boolean | RoundOffsets,
};

const unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto',
};

// Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.
function roundOffsetsByDPR({ x, y }, win: Window): Offsets {
  const dpr = win.devicePixelRatio || 1;

  return {
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0,
  };
}

export function mapToStyles({
  popper,
  popperRect,
  placement,
  variation,
  offsets,
  position,
  gpuAcceleration,
  adaptive,
  roundOffsets,
  isFixed,
}: {
  popper: HTMLElement,
  popperRect: Rect,
  placement: BasePlacement,
  variation: ?Variation,
  offsets: $Shape<{ x: number, y: number, centerOffset: number }>,
  position: PositioningStrategy,
  gpuAcceleration: boolean,
  adaptive: boolean,
  roundOffsets: boolean | RoundOffsets,
  isFixed: boolean,
}) {
  let { x = 0, y = 0 } = offsets;

  ({ x, y } =
    typeof roundOffsets === 'function' ? roundOffsets({ x, y }) : { x, y });

  const hasX = offsets.hasOwnProperty('x');
  const hasY = offsets.hasOwnProperty('y');

  let sideX: string = left;
  let sideY: string = top;

  const win: Window = window;

  if (adaptive) {
    let offsetParent = getOffsetParent(popper);
    let heightProp = 'clientHeight';
    let widthProp = 'clientWidth';

    if (offsetParent === getWindow(popper)) {
      offsetParent = getDocumentElement(popper);

      if (
        getComputedStyle(offsetParent).position !== 'static' &&
        position === 'absolute'
      ) {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    }

    // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it
    offsetParent = (offsetParent: Element);

    if (
      placement === top ||
      ((placement === left || placement === right) && variation === end)
    ) {
      sideY = bottom;
      const offsetY =
        isFixed && offsetParent === win && win.visualViewport
          ? win.visualViewport.height
          : // $FlowFixMe[prop-missing]
            offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (
      placement === left ||
      ((placement === top || placement === bottom) && variation === end)
    ) {
      sideX = right;
      const offsetX =
        isFixed && offsetParent === win && win.visualViewport
          ? win.visualViewport.width
          : // $FlowFixMe[prop-missing]
            offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  const commonStyles = {
    position,
    ...(adaptive && unsetSides),
  };

  ({ x, y } =
    roundOffsets === true
      ? roundOffsetsByDPR({ x, y }, getWindow(popper))
      : { x, y });

  if (gpuAcceleration) {
    return {
      ...commonStyles,
      [sideY]: hasY ? '0' : '',
      [sideX]: hasX ? '0' : '',
      // Layer acceleration can disable subpixel rendering which causes slightly
      // blurry text on low PPI displays, so we want to use 2D transforms
      // instead
      transform:
        (win.devicePixelRatio || 1) <= 1
          ? `translate(${x}px, ${y}px)`
          : `translate3d(${x}px, ${y}px, 0)`,
    };
  }

  return {
    ...commonStyles,
    [sideY]: hasY ? `${y}px` : '',
    [sideX]: hasX ? `${x}px` : '',
    transform: '',
  };
}

function computeStyles({ state, options }: ModifierArguments<Options>) {
  const {
    gpuAcceleration = true,
    adaptive = true,
    // defaults to use builtin `roundOffsetsByDPR`
    roundOffsets = true,
  } = options;

  const commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration,
    isFixed: state.options.strategy === 'fixed',
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = {
      ...state.styles.popper,
      ...mapToStyles({
        ...commonStyles,
        offsets: state.modifiersData.popperOffsets,
        position: state.options.strategy,
        adaptive,
        roundOffsets,
      }),
    };
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = {
      ...state.styles.arrow,
      ...mapToStyles({
        ...commonStyles,
        offsets: state.modifiersData.arrow,
        position: 'absolute',
        adaptive: false,
        roundOffsets,
      }),
    };
  }

  state.attributes.popper = {
    ...state.attributes.popper,
    'data-popper-placement': state.placement,
  };
}

// eslint-disable-next-line import/no-unused-modules
export type ComputeStylesModifier = Modifier<'computeStyles', Options>;
export default ({
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {},
}: ComputeStylesModifier);
