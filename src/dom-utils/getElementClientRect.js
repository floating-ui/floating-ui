// @flow
import getComputedStyle from './getComputedStyle';

// Returns the width, height and offsets of the provided element
export default (element: HTMLElement) => {
  // get the basic client rect, it doesn't include margins
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  const top = element.offsetTop;
  const left = element.offsetLeft;

  // get the element margins, we need them to properly align the popper
  const styles = getComputedStyle(element);

  const marginTop = parseFloat(styles.marginTop) || 0;
  const marginRight = parseFloat(styles.marginRight) || 0;
  const marginBottom = parseFloat(styles.marginBottom) || 0;
  const marginLeft = parseFloat(styles.marginLeft) || 0;

  return {
    width: width + marginLeft + marginRight,
    height: height + marginTop + marginBottom,
    y: top - marginTop,
    x: left - marginLeft,
  };
};
