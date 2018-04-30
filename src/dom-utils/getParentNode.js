// @flow
export default (element: Node | ShadowRoot): Node =>
  // $FlowFixMe find a way to always return a valid Node (and detect ShadowRoot)
  element.nodeName === 'HTML' ? element : element.parentNode || element.host;
