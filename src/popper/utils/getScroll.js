export default function getScroll(element, side = 'top') {
    const body = window.document.body;
    const html = window.document.documentElement;
    const scrollingElement = window.document.scrollingElement || html;

    const upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
    if (element === body || element === html) {
        return scrollingElement[upperSide];
    }
    return element[upperSide];
}
