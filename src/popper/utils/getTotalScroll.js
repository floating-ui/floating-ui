import getScrollParent from './getScrollParent';
import getScroll from './getScroll';
import getParentNode from './getParentNode';

export default function getTotalScroll(element, side = 'top') {
    const scrollParent = getScrollParent(element);
    const scroll = getScroll(scrollParent, side);

    if (['BODY', 'HTML'].indexOf(scrollParent.nodeName) === -1) {
        return scroll + getTotalScroll(getParentNode(scrollParent), side);
    }
    return scroll;
}
