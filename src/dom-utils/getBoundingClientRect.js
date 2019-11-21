// @flow
import type { ClientRectObject } from '../types';

export default (element: HTMLElement): ClientRectObject => {
  return JSON.parse(JSON.stringify(element.getBoundingClientRect()));
};
