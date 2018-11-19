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
  popperScrollParents: Array<Node>
) {
  // if the scrollParent is shared between the two elements, we don't pick
  // it because it wouldn't add anything to the equation (they nulllify themselves)
  const nonCommonReference = referenceScrollParents.filter(
    node => !popperScrollParents.includes(node)
  );

  // we then want to pick any scroll offset except for the one of the offsetParent
  // not sure why but that's how I got it working 😅
  // TODO: improve this comment with proper explanation
  const offsetParent = getOffsetParent(reference);
  const index = referenceScrollParents.findIndex(node => node === offsetParent);

  const scrollParents = referenceScrollParents.slice(
    0,
    index === -1 ? undefined : index
  );

  return sumScroll(scrollParents);
}
