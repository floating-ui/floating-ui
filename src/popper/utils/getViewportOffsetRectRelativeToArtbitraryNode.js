import getOffsetRectRelativeToArbitraryNode
  from './getOffsetRectRelativeToArbitraryNode';
import getScroll from './getScroll';
import getClientRect from './getClientRect';
import mathMax from './mathMax';

export default function getViewportOffsetRectRelativeToArtbitraryNode(element) {
  const html = window.document.documentElement;
  const relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
  const width = mathMax(html.clientWidth, window.innerWidth || 0);
  const height = mathMax(html.clientHeight, window.innerHeight || 0);

  const scrollTop = getScroll(html);
  const scrollLeft = getScroll(html, 'left');

  const offset = {
    top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
    left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
    width,
    height,
  };

  return getClientRect(offset);
}
