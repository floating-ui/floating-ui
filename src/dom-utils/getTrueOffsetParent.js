// @flow
import { isHTMLElement } from './instanceOf';

export default (element: Element): ?Element =>
  isHTMLElement(element) ? element.offsetParent : null;
