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
    x: Math.round(x * dpr) / dpr || 0,
    y: Math.round(y * dpr) / dpr || 0,
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
  const hasX = offsets.hasOwnProperty('x');
  const hasY = offsets.hasOwnProperty('y');

  // Layer acceleration can disable subpixel rendering which causes slightly
  // blurry text on low PPI displays.
  // Zooming can change the DPR, but it seems to report a value that will
  // cleanly divide the values into the appropriate subpixels.
  if (gpuAcceleration === false || window.devicePixelRatio < 2) {
    return {
      top: hasY ? `${y}px` : '',
      left: hasX ? `${x}px` : '',
      transform: '',
      position,
    };
  } else {
    return {
      top: hasY ? '0' : '',
      left: hasX ? '0' : '',
      transform: `translate3d(${x}px, ${y}px, 0)`,
      position,
    };
  }
};

function computeStyles({ state, options }: ModifierArguments<Options>) {
  const { gpuAcceleration = true } = options;

  // popper offsets are always available
  state.styles.popper = {
    ...state.styles.popper,
    ...mapToStyles({
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      gpuAcceleration,
    }),
  };

  // arrow offsets may not be available
  if (state.modifiersData.arrow != null) {
    state.styles.arrow = {
      ...state.styles.arrow,
      ...mapToStyles({
        offsets: state.modifiersData.arrow,
        position: 'absolute',
        gpuAcceleration,
      }),
    };
  }

  state.attributes.popper = {
    ...state.attributes.popper,
    'data-popper-placement': state.placement,
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
