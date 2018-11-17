// @flow

// Returns the width, height and offsets of the provided element
export default (element: Element) => {
  // get the basic client rect, it doesn't include margins
  const { width, height, top, left } = element.getBoundingClientRect();

  // get the element margins, we need them to properly align the popper
  const window = element.ownerDocument.defaultView;
  const styles = window.getComputedStyle(element);

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
