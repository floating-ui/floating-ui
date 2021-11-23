/* eslint-disable import/no-unused-modules */
// @flow
import type {
  VirtualElement,
  PositionConfig,
  ComputePositionReturn,
} from '@popperjs/core/src/types';
import { computePosition as computePositionCore } from '@popperjs/core';
import { platform } from './platform';

export const computePosition = (
  reference: Element | VirtualElement,
  popper: HTMLElement,
  options: $Shape<PositionConfig> = {}
): Promise<ComputePositionReturn> =>
  computePositionCore(reference, popper, { platform, ...options });

export { default as listScrollParents } from './utils/listScrollParents';

export {
  arrow,
  autoPlacement,
  flip,
  hide,
  limitShift,
  offset,
  shift,
  size,
} from '@popperjs/core';
