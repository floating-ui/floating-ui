import getStyleComputedProperty from './getStyleComputedProperty';
/**
 * Returns the offset parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} offset parent
 */
export default function getOffsetParent(element) {
  // NOTE: 1 DOM access here
  let offsetParent = element && element.offsetParent;
  while (offsetParent === null && element.nextElementSibling) {
    offsetParent = (element = element.nextElementSibling).offsetParent;
  }
  const nodeName = offsetParent && offsetParent.nodeName;

  if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
    if (element) {
      return element.ownerDocument.documentElement
    }

    return document.documentElement;
  }

  // .offsetParent will return the closest TD or TABLE in case
  // no offsetParent is present, I hate this job...
  if (
    ['TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 &&
    getStyleComputedProperty(offsetParent, 'position') === 'static'
  ) {
    return getOffsetParent(offsetParent);
  }

  return offsetParent;
}
