export default function getScroll(element, side = 'top') {
    const upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
    const nodeName = element.nodeName;

    if (nodeName === 'BODY' || nodeName === 'HTML') {
        const html = window.document.documentElement;
        const scrollingElement = window.document.scrollingElement || html;
        return scrollingElement[upperSide];
    }

    return element[upperSide];
}
