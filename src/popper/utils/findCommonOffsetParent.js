import isOffsetContainer from './isOffsetContainer';

export default function findCommonOffsetParent(element1, element2) {
    const range = document.createRange();
    if (element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING) {
        range.setStart(element1, 0);
        range.setEnd(element2, 0);
    } else {
        range.setStart(element2, 0);
        range.setEnd(element1, 0);
    }

    const { commonAncestorContainer } = range;
    if (isOffsetContainer(commonAncestorContainer)) {
        return commonAncestorContainer;
    }

    // This is probably very stupid, fix me please
    if (!commonAncestorContainer) {
        return window.document.documentElement;
    }

    const offsetParent = commonAncestorContainer.offsetParent;

    return offsetParent.nodeName === 'BODY' ? document.documentElement : offsetParent;
}
