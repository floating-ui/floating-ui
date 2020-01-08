// @flow
import type {
  PositioningStrategy,
  Offsets,
  Modifier,
  ModifierArguments,
} from '../types';

type Options = {
  gpuAcceleration: boolean,
};

// Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.
function roundOffsets({ x, y }): Offsets {
  const dpr = window.devicePixelRatio;

  return {
    x: Math.round(x * dpr) / dpr || 0,
    y: Math.round(y * dpr) / dpr || 0,
  };
}

export function mapToStyles({
  offsets,
  position,
  gpuAcceleration,
}: {
  offsets: Offsets,
  position: PositioningStrategy,
  gpuAcceleration: boolean,
}) {
  const { x, y } = roundOffsets(offsets);
  const hasX = offsets.hasOwnProperty('x');
  const hasY = offsets.hasOwnProperty('y');

  if (gpuAcceleration) {
    return {
      position,
      top: hasY ? '0' : '',
      left: hasX ? '0' : '',
      // Layer acceleration can disable subpixel rendering which causes slightly
      // blurry text on low PPI displays, so we want to use 2D transforms
      // instead
      transform:
        window.devicePixelRatio < 2
          ? `translate(${x}px, ${y}px)`
          : `translate3d(${x}px, ${y}px, 0)`,
    };
  }

  return {
    position,
    top: hasY ? `${y}px` : '',
    left: hasX ? `${x}px` : '',
    transform: '',
  };
}

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
}

export default ({
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {},
}: Modifier<Options>);
