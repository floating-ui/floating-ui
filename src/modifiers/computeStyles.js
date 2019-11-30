// @flow
import type { State, PositioningStrategy, Offsets, Modifier } from '../types';

// This modifier takes the Popper state and prepares some StyleSheet properties
// that can be applied to the popper element to make it render in the expected position.

type Options = {
  gpuAcceleration?: boolean,
};

export const mapStrategyToPosition = (
  strategy: PositioningStrategy
): string => {
  switch (strategy) {
    case 'fixed':
      return 'fixed';
    case 'absolute':
    default:
      return 'absolute';
  }
};

export const computePopperStyles = ({
  offsets,
  strategy,
  gpuAcceleration,
}: {
  offsets: Offsets,
  strategy: PositioningStrategy,
  gpuAcceleration: boolean,
}) => {
  // @1x displays in Chrome can be blurry due to non-rounded offsets, but this
  // introduces slight positioning errors. TODO: somehow solve this better
  // by default it is active, disable it only if explicitly set to false
  if (gpuAcceleration === false || window.devicePixelRatio < 2) {
    return {
      top: `${offsets.y}px`,
      left: `${offsets.x}px`,
      position: mapStrategyToPosition(strategy),
    };
  } else {
    return {
      top: '0px',
      left: '0px',
      transform: `translate3d(${offsets.x}px, ${offsets.y}px, 0)`,
      position: mapStrategyToPosition(strategy),
    };
  }
};

export const computeArrowStyles = ({
  offsets,
  gpuAcceleration,
}: {
  offsets: Offsets,
  gpuAcceleration: boolean,
}) => {
  if (gpuAcceleration) {
    return {
      top: `${offsets.y}px`,
      left: `${offsets.x}px`,
      position: 'absolute',
    };
  } else {
    return {
      transform: `translate3d(${offsets.x}px, ${offsets.y}px, 0)`,
      position: 'absolute',
    };
  }
};

export function computeStyles(state: State, options?: Options = {}) {
  const { gpuAcceleration = true } = options;

  state.modifiersData.computeStyles = {
    styles: {
      // popper offsets are always available
      popper: computePopperStyles({
        offsets: state.modifiersData.popperOffsets,
        strategy: state.options.strategy,
        gpuAcceleration,
      }),
      // arrow offsets may not be available
      arrow:
        state.modifiersData.arrowOffsets != null
          ? computeArrowStyles({
              offsets: state.modifiersData.arrowOffsets,
              gpuAcceleration,
            })
          : undefined,
    },
    attributes: {
      popper: { 'data-popper-placement': state.placement },
    },
  };

  return state;
}

export default ({
  name: 'computeStyles',
  enabled: true,
  phase: 'afterMain',
  fn: computeStyles,
  data: {},
}: Modifier<Options>);
