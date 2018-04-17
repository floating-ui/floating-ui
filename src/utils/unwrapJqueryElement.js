// @flow
export default (element: any): Element =>
  element && element.jquery ? element[0] : element;
