export function isRTL(element: Element) {
  return getComputedStyle(element).direction === 'rtl';
}
