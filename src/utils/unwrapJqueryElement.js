// @flow
export default (element: any): HTMLElement =>
  element && element.jquery ? element[0] : element;
