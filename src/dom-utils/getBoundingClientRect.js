// @flow
import type { ClientRectObject } from '../types';

export default (element: Element): ClientRectObject => {
  return JSON.parse(JSON.stringify(element.getBoundingClientRect()));
};
