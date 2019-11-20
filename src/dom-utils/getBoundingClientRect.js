// @flow
type ClientRectObject = {
  x: number,
  y: number,
  top: number,
  left: number,
  right: number,
  bottom: number,
  width: number,
  height: number,
};

export default (element: HTMLElement): ClientRectObject => {
  return JSON.parse(JSON.stringify(element.getBoundingClientRect()));
};
