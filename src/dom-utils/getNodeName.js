// @flow

export default (element: ?Node): ?string =>
  element ? (element.nodeName || '').toLowerCase() : null;
