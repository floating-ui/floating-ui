// @flow
export default function getWindow(node: mixed) {
  const ownerDocument: ?Document =
    node != null &&
    typeof node === 'object' &&
    node.hasOwnProperty('ownerDocument')
      ? // $FlowFixMe: assume ownerDocument to be the one we are looking for
        node.ownerDocument
      : null;
  return ownerDocument != null ? ownerDocument.defaultView : window;
}
