/**
 * Get CSS computed property of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {String} property
 * @returns {String}
 */
export default function getStyleComputedProperty(element, property) {
  if (element.nodeType !== 1) {
    return [];
  }
  // NOTE: 1 DOM access here
  const window = element.ownerDocument.defaultView;
  const css = window.getComputedStyle(element, null);
  return property ? css[property] : css;
}
