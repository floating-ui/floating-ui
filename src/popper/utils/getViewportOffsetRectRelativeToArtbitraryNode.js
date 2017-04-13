import getOffsetRectRelativeToArbitraryNode from './getOffsetRectRelativeToArbitraryNode';
import getScroll from './getScroll';

export default function getViewportOffsetRectRelativeToArtbitraryNode(element) {
    const html = window.document.documentElement;
    const relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
    const width = Math.max(html.clientWidth, window.innerWidth || 0);
    const height = Math.max(html.clientHeight, window.innerHeight || 0);

    const scrollTop = getScroll(html);
    const scrollLeft = getScroll(html, 'left');

    console.log(relativeOffset, scrollTop, scrollLeft);

    return {
        top: scrollTop - relativeOffset.top ,
        bottom: scrollTop - relativeOffset.top + height,
        left: scrollLeft - relativeOffset.left,
        right: scrollLeft - relativeOffset.left + width,
    };
}
