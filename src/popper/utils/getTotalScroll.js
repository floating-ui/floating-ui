import getScrollParent from './getScrollParent';

export default function getTotalScroll(element, side = 'top') {
    const body = window.document.body;
    const html = window.document.documentElement;

    const scrollParent = getScrollParent(element);
    const upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
    const scroll = scrollParent[upperSide];

    if (scrollParent !== html && scrollParent !== body) {
        return scroll + getTotalScroll(scrollParent.parentNode);
    }
    return scroll;
}
