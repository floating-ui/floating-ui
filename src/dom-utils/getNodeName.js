// @flow

export default function getNodeName(element: ?Node): ?string {
  return element ? (element.nodeName || '').toLowerCase() : null;
}
