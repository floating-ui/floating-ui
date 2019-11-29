// @flow
import getNodeScroll from './getNodeScroll';
import getOffsetParent from './getOffsetParent';

const sumScroll = scrollParents =>
  scrollParents.reduce(
    (scroll, scrollParent) => {
      const nodeScroll = getNodeScroll(scrollParent);
      scroll.scrollTop += nodeScroll.scrollTop;
      scroll.scrollLeft += nodeScroll.scrollLeft;
      return scroll;
    },
    { scrollTop: 0, scrollLeft: 0 }
  );

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

  return sumScroll(scrollParents);
}
