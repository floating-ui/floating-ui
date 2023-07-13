import {getWindow} from '../utils/getWindow';

export function isElement(value: any): value is Element {
  return value instanceof Element || value instanceof getWindow(value).Element;
}
