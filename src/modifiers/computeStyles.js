// @flow
import type { State, PositioningStrategy, Offsets } from '../types';

// This modifier takes the Popper.js state and prepares some StyleSheet properties
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
  // by default it is active, disable it only if explicitly set to false
  if (gpuAcceleration === false) {
    return {
      top: `${offsets.y}px`,
      left: `${offsets.x}px`,
      position: mapStrategyToPosition(strategy),
    };
  } else {
    return {
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

export function computeStyles(state: State, options: ?Options) {
  const gpuAcceleration =
    options && options.gpuAcceleration != null ? options.gpuAcceleration : true;

  state.styles = {};

  // popper offsets are always available
  state.styles.popper = computePopperStyles({
    offsets: state.offsets.popper,
    strategy: state.options.strategy,
    gpuAcceleration,
  });

  // arrow offsets may not be available
  if (state.offsets.arrow != null) {
    state.styles.arrow = computeArrowStyles({
      offsets: state.offsets.arrow,
      gpuAcceleration,
    });
  }

  return state;
}

export default {
  name: 'computeStyles',
  enabled: true,
  phase: 'main',
  fn: computeStyles,
};
