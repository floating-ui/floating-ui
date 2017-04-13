import getOffsetRectRelativeToArbitraryNode from './getOffsetRectRelativeToArbitraryNode';
import getScroll from './getScroll';

export default function getViewportOffsetRectRelativeToArtbitraryNode(element) {
    const html = window.document.documentElement;
    const relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
    const width = Math.max(html.clientWidth, window.innerWidth || 0);
    const height = Math.max(html.clientHeight, window.innerHeight || 0);

    const scrollTop = getScroll(html);
    const scrollLeft = getScroll(html, 'left');

    return {
        top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
        bottom: scrollTop - relativeOffset.top + relativeOffset.marginTop + height,
        left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
        right: scrollLeft - relativeOffset.left + relativeOffset.marginLeft + width,
    };
}
