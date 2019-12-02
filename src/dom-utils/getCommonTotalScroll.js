// @flow
import getOffsetParent from './getOffsetParent';
import getScrollSum from './getScrollSum';

export default function getCommonTotalScroll(
  referenceElement: Element,
  referenceScrollParents: Array<Element>,
  popperScrollParents: Array<Element>,
  limiter?: Node
) {
  const offsetParent = getOffsetParent(referenceElement);
  const index = referenceScrollParents.findIndex(
    node => node === (limiter || offsetParent)
  );

  const scrollParents = referenceScrollParents.slice(
    0,
    index === -1 ? undefined : index
  );

  return getScrollSum(scrollParents);
}
