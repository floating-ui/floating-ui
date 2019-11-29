// @flow
import getNodeScroll from './getNodeScroll';
import getOffsetParent from './getOffsetParent';
import getScrollSum from './getScrollSum';

export default function getCommonTotalScroll(
  reference: HTMLElement,
  referenceScrollParents: Array<Node>,
  popperScrollParents: Array<Node>,
  limiter?: Node
) {
  const offsetParent = getOffsetParent(reference);
  const index = referenceScrollParents.findIndex(
    node => node === (limiter || offsetParent)
  );

  const scrollParents = referenceScrollParents.slice(
    0,
    index === -1 ? undefined : index
  );

  return getScrollSum(scrollParents);
}
