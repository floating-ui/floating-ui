export default function getScroll(element, side = 'top') {
    const upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';

    if (element.nodeName === 'BODY' || element.nodeName === 'HTML') {
        const html = window.document.documentElement;
        const scrollingElement = window.document.scrollingElement || html;
        return scrollingElement[upperSide];
    }

    return element[upperSide];
}
