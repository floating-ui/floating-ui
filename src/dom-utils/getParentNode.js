// @flow
export default (element: Node | ShadowRoot): Node => {
  if (element.nodeName === 'HTML') {
    // DocumentElement detectedF
    return element;
  }
  return (
    element.parentNode || // DOM Element detected
    // $FlowFixMe: need a better way to handle this...
    element.host || // ShadowRoot detected
    document.ownerDocument || // Fallback to ownerDocument if available
    document.documentElement // Or to documentElement if everything else fails
  );
};
