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

// Round the offsets to the nearest suitable subpixel based on the DPR
const roundOffsets = ({ x, y }) => {
  const dpr = window.devicePixelRatio;
  return {
    x: Math.round(x * dpr) / dpr,
    y: Math.round(y * dpr) / dpr,
  };
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
  const { x, y } = roundOffsets(offsets);

  // Layer acceleration can disable subpixel rendering which causes slightly
  // blurry text on low PPI displays.
  // Zooming can change the DPR, but it seems to report a value that will
  // cleanly divide the values into the appropriate subpixels.
  if (gpuAcceleration === false || window.devicePixelRatio < 2) {
    return {
      top: `${y}px`,
      left: `${x}px`,
      transform: '',
      position,
    };
  } else {
    return {
      top: '0px',
      left: '0px',
      transform: `translate3d(${x}px, ${y}px, 0)`,
      position,
    };
  }
};

export function computeStyles({ state, options }: ModifierArguments<Options>) {
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
