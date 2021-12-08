import {NodeScroll} from '../types';
import {isWindow} from './window';

export function getNodeScroll(element: Element | Window): NodeScroll {
  if (isWindow(element)) {
    return {
      scrollLeft: element.pageXOffset,
      scrollTop: element.pageYOffset,
    };
  }

  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop,
  };
}
