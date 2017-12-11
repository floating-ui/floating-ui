import getScrollParent from './getScrollParent';
import getParentNode from './getParentNode';
import findCommonOffsetParent from './findCommonOffsetParent';
import getOffsetRectRelativeToArbitraryNode from './getOffsetRectRelativeToArbitraryNode';
import getViewportOffsetRectRelativeToArtbitraryNode from './getViewportOffsetRectRelativeToArtbitraryNode';
import getWindowSizes from './getWindowSizes';
import isFixed from './isFixed';

/**
 * Computed the boundaries limits and return them
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} popper
 * @param {HTMLElement} reference
 * @param {number} padding
 * @param {HTMLElement} boundariesElement - Element used to define the boundaries
 * @param {HTMLElement} fixedParentRef - Force this element as the parent
 * @returns {Object} Coordinates of the boundaries
 */
export default function getBoundaries(
  popper,
  reference,
  padding,
  boundariesElement,
  fixedParent = false
) {
  // NOTE: 1 DOM access here

  let boundaries = { top: 0, left: 0 };
  const offsetParent = fixedParent ? popper.ownerDocument.documentElement : findCommonOffsetParent(popper, reference);

  // Handle viewport case
  if (boundariesElement === 'viewport' ) {
    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent);
  }
  //Handle absolute viewport, i.e complete edges ignoring scrolls and padding s
  else if (boundariesElement === 'absoluteViewport') {
    const winSize = getViewportOffsetRectRelativeToArtbitraryNode(popper.ownerDocument.documentElement);
    boundaries = { ...boundaries, bottom: winSize.height, right: winSize.width };
  }
  else {
    // Handle other cases based on DOM element used as boundaries
    let boundariesNode;
    if (boundariesElement === 'scrollParent') {
      boundariesNode = getScrollParent(getParentNode(reference));
      if (boundariesNode.nodeName === 'BODY') {
        boundariesNode = popper.ownerDocument.documentElement;
      }
    } else if (boundariesElement === 'window') {
      boundariesNode = popper.ownerDocument.documentElement;
    } else {
      boundariesNode = boundariesElement;
    }

    const offsets = getOffsetRectRelativeToArbitraryNode(
      boundariesNode,
      offsetParent,
      fixedParent
    );

    // In case of HTML, we need a different computation
    if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
      const { height, width } = getWindowSizes();
      boundaries.top += offsets.top - offsets.marginTop;
      boundaries.bottom = height + offsets.top;
      boundaries.left += offsets.left - offsets.marginLeft;
      boundaries.right = width + offsets.left;
    } else {
      // for all the other DOM elements, this one is good
      boundaries = offsets;
    }
  }

  // Add paddings
  boundaries.left += padding;
  boundaries.top += padding;
  boundaries.right -= padding;
  boundaries.bottom -= padding;

  return boundaries;
}
