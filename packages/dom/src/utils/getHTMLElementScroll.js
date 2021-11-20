// @flow

export default function getHTMLElementScroll(element: HTMLElement): {
  scrollLeft: number,
  scrollTop: number,
} {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop,
  };
}
