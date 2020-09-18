/*
 * Helper to get the node name of an element that supports both HTML and
 * XHTML.
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {string} name
 */
export default function getNodeName(element) {
	return element && element.nodeName && element.nodeName.toUpperCase();
}
