/* eslint-disable import/no-unused-modules */
// @flow
import type { VirtualElement, PositionConfig } from '@popperjs/core/src/types';
import { position as positionCore } from '@popperjs/core';
import { platform } from './platform';

export const position = (
  reference: Element | VirtualElement,
  popper: HTMLElement,
  options: $Shape<PositionConfig> = {}
) => positionCore(reference, popper, { platform, ...options });

export { default as listScrollParents } from './utils/listScrollParents';

export {
  arrow,
  auto,
  flip,
  hide,
  limitShift,
  offset,
  shift,
  size,
} from '@popperjs/core';
