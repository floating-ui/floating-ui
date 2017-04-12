import getScrollParent from './getScrollParent';
import getScroll from './getScroll';
import getParentNode from './getParentNode';
import isOffsetContainer from './isOffsetContainer';

export default function getTotalScroll(element, parent, side = 'top') {
    const scrollParent = getScrollParent(element);
    let scroll = 0;
    if (isOffsetContainer(scrollParent.nodeName === 'BODY' ? window.document.documentElement : scrollParent)) {
        scroll = getScroll(scrollParent, side);
    }

    if (parent === scrollParent || ['BODY', 'HTML'].indexOf(scrollParent.nodeName) === -1) {
        return scroll + getTotalScroll(getParentNode(scrollParent), parent, side);
    }
    return scroll;
}
