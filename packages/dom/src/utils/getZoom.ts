import {isElement} from '../platform/isElement';

// The standardized CSS `zoom` property (Chrome 128+, Firefox 126+) makes
// `getBoundingClientRect()` report zoomed viewport pixels, while `left`/`top`
// and layout metrics stay in the element's own unzoomed coordinate space.
// `currentCSSZoom` is the cumulative zoom of the ancestor chain, and is absent
// in browsers whose rects are already unzoomed (WebKit), where it must be 1.
export function getZoom(element: Element | Window): number {
  return (isElement(element) && (element as any).currentCSSZoom) || 1;
}
