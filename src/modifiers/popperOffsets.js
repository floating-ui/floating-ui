// @flow
import type { ModifierArguments, Modifier } from '../types';
import computeOffsets from '../utils/computeOffsets';
import getCommonTotalScroll from '../dom-utils/getCommonTotalScroll';
import unwrapVirtualElement from '../dom-utils/unwrapVirtualElement';

export function popperOffsets({ state, namespace }: ModifierArguments<void>) {
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData.popperOffsets[namespace] = computeOffsets({
    reference: state.measures.reference,
    element: state.measures.popper,
    strategy: 'absolute',
    placement: state.placement,
    scroll: getCommonTotalScroll(
      unwrapVirtualElement(state.elements.reference),
      state.scrollParents.reference,
      state.scrollParents.popper
    ),
  });

  return state;
}

export default ({
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {},
}: Modifier<void>);
