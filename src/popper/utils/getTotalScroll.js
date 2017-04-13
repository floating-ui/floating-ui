import getScrollParent from './getScrollParent';
import getScroll from './getScroll';
import getParentNode from './getParentNode';
import isOffsetContainer from './isOffsetContainer';
import isFixed from './isFixed';

export default function getTotalScroll(element, parent, side = 'top') {
    const scrollParent = getScrollParent(element);
    let scroll = 0;
    const isParentFixed = isFixed(parent);

    // NOTE: I'm not sure the second line of this check is completely correct, review it if
    // someone complains about viewport problems in future
    if (
        isOffsetContainer(scrollParent.nodeName === 'BODY' ? window.document.documentElement : scrollParent) &&
        ((parent.contains(scrollParent) && isParentFixed) || !isParentFixed)
    ) {
        scroll = getScroll(scrollParent, side);
    }

    if (parent === scrollParent || ['BODY', 'HTML'].indexOf(scrollParent.nodeName) === -1) {
        return scroll + getTotalScroll(getParentNode(scrollParent), parent, side);
    }
    return scroll;
}
