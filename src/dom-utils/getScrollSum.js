// @flow
import getNodeScroll from './getNodeScroll';

export default function getScrollSum(scrollParents: Array<Element>) {
  return scrollParents.reduce(
    (scroll, scrollParent) => {
      const nodeScroll = getNodeScroll(scrollParent);
      scroll.scrollTop += nodeScroll.scrollTop;
      scroll.scrollLeft += nodeScroll.scrollLeft;
      return scroll;
    },
    { scrollTop: 0, scrollLeft: 0 }
  );
}
