// Utils
import getWindow from './utils/getWindow';

/**
 * Get CSS computed property of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Eement} element
 * @argument {String} property
 */
export default function getStyleComputedProperty(element, property) {
  if (element.nodeType !== 1) {
    return [];
  }
  // NOTE: 1 DOM access here
  const window = getWindow(element);
  const css = window.getComputedStyle(element, null);
  return property ? css[property] : css;
}
