// @flow
import type { State, Modifier } from '../types';
import getElementClientRect from '../dom-utils/getElementClientRect';
import getScrollParent from '../dom-utils/getScrollParent';
import getCommonTotalScroll from '../dom-utils/getCommonTotalScroll';
import listScrollParents from '../dom-utils/listScrollParents';
import computeOffsets from '../utils/computeOffsets';

type Options = {
  boundaryElement: HTMLElement,
};

export function preventOverflow(state: State, options: ?Options) {
  // const boundaryElement = getScrollParent(
  //   getScrollParent(state.elements.reference).parentNode
  // );

  // const boundaries = getElementClientRect(boundaryElement);

  // const scroll = getCommonTotalScroll(
  //   state.elements.reference,
  //   state.scrollParents.reference,
  //   state.scrollParents.popper,
  //   //listScrollParents(boundaryElement),
  //   boundaryElement
  // );

  // const boundaryOffsets = computeOffsets({
  //   element: boundaries,
  //   reference: state.measures.reference,
  //   scroll,
  //   strategy: state.options.strategy,
  // });

  // const offsets = state.offsets.popper;

  // offsets.y = Math.max(offsets.y, boundaryOffsets.y);

  // state.offsets.popper = offsets;

  // console.log(scroll, offsets, boundaryOffsets);

  return state;
}

export default ({
  name: 'preventOverflow',
  enabled: true,
  phase: 'read',
  fn: preventOverflow,
}: Modifier);
