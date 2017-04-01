import getOffsetRect from './getOffsetRect';
import getOffsetParent from './getOffsetParent';

export default function getOffsetRectRelativeToViewport(element) {
    // Offset relative to offsetParent
    const relativeOffset = getOffsetRect(element);

    if (element.nodeName !== 'HTML') {
        const offsetParent = getOffsetParent(element);
        const parentOffset = getOffsetRectRelativeToViewport(offsetParent);
        const offset = {
            width: relativeOffset.offsetWidth,
            height: relativeOffset.offsetHeight,
            left: relativeOffset.left + parentOffset.left,
            top: relativeOffset.top + parentOffset.top,
            right: relativeOffset.right - parentOffset.right,
            bottom: relativeOffset.bottom - parentOffset.bottom,
        };
        return offset;
    }

    return relativeOffset;
}
