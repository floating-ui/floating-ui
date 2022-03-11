import {getDocument} from './getDocument';

function getWindow(value: any) {
  return getDocument(value).defaultView ?? window;
}

export function isElement(value: any): value is HTMLElement {
  return value ? value instanceof getWindow(value).Element : false;
}

export function isHTMLElement(value: any): value is HTMLElement {
  return value ? value instanceof getWindow(value).HTMLElement : false;
}
