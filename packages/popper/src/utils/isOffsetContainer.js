import getOffsetParent from './getOffsetParent';

/**
 * Check if the given element is fixed or is inside a fixed parent
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Boolean} answer to "isOffsetContainer?"
 */
export default function isOffsetContainer(element) {
  const nodeName = element.nodeName.toUpperCase();
  if (nodeName === 'BODY') {
    return false;
  }
  return (
    nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element
  );
}
