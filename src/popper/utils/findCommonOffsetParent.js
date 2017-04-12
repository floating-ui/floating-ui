import isOffsetContainer from './isOffsetContainer';

export default function findCommonOffsetParent(element1, element2) {
    const range = document.createRange();
    // This check is needed to avoid errors in case one of the elements isn't defined for any reason
    if (element1 && element2) {
        // Here we make sure to give as "start" the element that comes first in the DOM
        if (element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING) {
            range.setStart(element1, 0);
            range.setEnd(element2, 0);
        } else {
            range.setStart(element2, 0);
            range.setEnd(element1, 0);
        }
    } else {
        return window.document.documentElement;
    }

    const { commonAncestorContainer } = range;

    // Both nodes are inside #document
    if (![element1, element2].indexOf(commonAncestorContainer) !== -1) {
        if (isOffsetContainer(commonAncestorContainer)) {
            return commonAncestorContainer;
        }

        const offsetParent = commonAncestorContainer && commonAncestorContainer.offsetParent;

        if (!offsetParent || offsetParent && offsetParent.nodeName === 'BODY') {
            return window.document.documentElement;
        }

        return offsetParent;
    }

    // one of the nodes is inside shadowDOM
    if (element1.getRootNode().host) {
        return findCommonOffsetParent(element1.getRootNode().host, element2);
    } else {
        return findCommonOffsetParent(element1, element2.getRootNode().host);
    }
}
