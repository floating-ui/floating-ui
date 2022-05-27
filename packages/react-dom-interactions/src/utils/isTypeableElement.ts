import {isHTMLElement} from './is';

export const TYPEABLE_SELECTOR =
  "input:not([type='hidden']):not([disabled])," +
  "[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";

export function isTypeableElement(element: unknown): boolean {
  return isHTMLElement(element) && element.matches(TYPEABLE_SELECTOR);
}
