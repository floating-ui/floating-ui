import getScrollParent from './getScrollParent';
import getScroll from './getScroll';
import getParentNode from './getParentNode';

export default function getTotalScroll(element, side = 'top') {
    const body = window.document.body;
    const html = window.document.documentElement;

    const scrollParent = getScrollParent(element);
    const scroll = getScroll(scrollParent, side);

    if (scrollParent !== body && scrollParent !== html) {
        return scroll + getTotalScroll(getParentNode(scrollParent), side);
    }
    return scroll;
}
