export default function getScroll(element, side = 'top') {
    const html = window.document.documentElement;
    const scrollingElement = window.document.scrollingElement || html;

    const upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
    if (element.nodeName === 'BODY' || element.nodeName === 'HTML') {
        return scrollingElement[upperSide];
    }
    return element[upperSide];
}
