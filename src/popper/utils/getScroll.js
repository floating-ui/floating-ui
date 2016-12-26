export default function getScroll(element, side = 'top') {
    const body = window.document.body;
    const html = window.document.documentElement;

    const upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
    if (element === body || element === html) {
      return (window.document.scrollingElement || html)[upperSide];
    }
    return element[upperSide];
}
