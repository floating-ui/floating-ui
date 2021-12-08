import {
  computePosition as computePositionCore,
  ComputePositionConfig,
  VirtualElement,
} from '@floating-ui/core';
import {platform} from './platform';

export const computePosition = (
  reference: Element | VirtualElement,
  floating: HTMLElement,
  options: Partial<ComputePositionConfig>
) => computePositionCore(reference, floating, {platform, ...options});

export {
  arrow,
  autoPlacement,
  flip,
  hide,
  offset,
  shift,
  limitShift,
  size,
  detectOverflow,
} from '@floating-ui/core';

export {getScrollParents} from './utils/getScrollParents';
