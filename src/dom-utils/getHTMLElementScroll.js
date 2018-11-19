// @flow

export default function getHTMLElementScroll(element: HTMLElement) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop,
  };
}
