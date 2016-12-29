import getScrollParent from './getScrollParent';
import getScroll from './getScroll';
import getParentNode from './getParentNode';

export default function getTotalScroll(element, side = 'top') {
    const scrollParent = getScrollParent(element);
    const scroll = getScroll(scrollParent, side);

    if (scrollParent.nodeName !== 'BODY' && scrollParent.nodeName !== 'HTML') {
        return scroll + getTotalScroll(getParentNode(scrollParent), side);
    }
    return scroll;
}
