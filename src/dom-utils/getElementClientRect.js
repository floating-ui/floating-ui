// @flow

// Returns the width, height and offsets of the provided element
export default (element: Element) => {
  const { width, height, top, left } = element.getBoundingClientRect();
  return { width, height, y: top, x: left };
};
