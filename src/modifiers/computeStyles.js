// @flow
import type {
  PositioningStrategy,
  Offsets,
  Modifier,
  ModifierArguments,
} from '../types';

// This modifier takes the Popper state and prepares some StyleSheet properties
// that can be applied to the popper element to make it render in the expected position.

type Options = {
  gpuAcceleration?: boolean,
};

export const mapToStyles = ({
  offsets,
  position,
  gpuAcceleration,
}: {
  offsets: Offsets,
  position: PositioningStrategy,
  gpuAcceleration: boolean,
}) => {
  // @1x displays in Chrome can be blurry due to non-rounded offsets, but this
  // introduces slight positioning errors. TODO: somehow solve this better
  // by default it is active, disable it only if explicitly set to false
  if (gpuAcceleration === false || window.devicePixelRatio < 2) {
    return {
      top: `${offsets.y}px`,
      left: `${offsets.x}px`,
      position,
    };
  } else {
    return {
      top: '0px',
      left: '0px',
      transform: `translate3d(${offsets.x}px, ${offsets.y}px, 0)`,
      position,
    };
  }
};

export function computeStyles({
  state,
  options = {},
}: ModifierArguments<Options>) {
  const { gpuAcceleration = true } = options;

  state.modifiersData.computeStyles = {
    styles: {
      // popper offsets are always available
      popper: mapToStyles({
        offsets: state.modifiersData.popperOffsets,
        position: state.options.strategy,
        gpuAcceleration,
      }),
      // arrow offsets may not be available
      arrow:
        state.modifiersData.arrow != null
          ? mapToStyles({
              offsets: state.modifiersData.arrow,
              position: 'absolute',
              gpuAcceleration: false,
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
