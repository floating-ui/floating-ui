// @flow
import getElementMargins from './getElementMargins';

// Returns the width, height and offsets of the provided element
export default (element: HTMLElement) => {
  // get the basic client rect, it doesn't include margins
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  const top = element.offsetTop;
  const left = element.offsetLeft;

  const margins = getElementMargins(element);

  return {
    width: width + margins.left + margins.right,
    height: height + margins.top + margins.bottom,
    y: top - margins.top,
    x: left - margins.left,
  };
};
