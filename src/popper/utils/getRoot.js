/**
 * Finds the root node (document, shadowDOM root) of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} node
 * @returns {Element} root node
 */
export default function getRoot(node) {
  while (node.parentNode !== null) {
    node = node.parentNode;
  }

  return node;
}
