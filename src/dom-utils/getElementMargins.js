// @flow
import getComputedStyle from './getComputedStyle';

export default (element: HTMLElement) => {
  // get the element margins, we need them to properly align the popper
  const styles = getComputedStyle(element);

  const top = parseFloat(styles.marginTop) || 0;
  const right = parseFloat(styles.marginRight) || 0;
  const bottom = parseFloat(styles.marginBottom) || 0;
  const left = parseFloat(styles.marginLeft) || 0;

  return { top, right, bottom, left };
};
