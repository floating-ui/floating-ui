import getScrollParent from './getScrollParent';
import getScroll from './getScroll';
import getParentNode from './getParentNode';

export default function getTotalScroll(element, parent, side = 'top') {
    const scrollParent = getScrollParent(element);
    const scroll = getScroll(scrollParent, side);

    if (parent === scrollParent || ['BODY', 'HTML'].indexOf(scrollParent.nodeName) === -1) {
        return scroll + getTotalScroll(getParentNode(scrollParent), parent, side);
    }
    return scroll;
}
