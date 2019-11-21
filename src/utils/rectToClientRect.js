// @flow

import type { Rect, ClientRectObject } from '../types';

export default (rect: Rect): ClientRectObject => ({
  ...rect,
  left: rect.x,
  top: rect.y,
  right: rect.x + rect.width,
  bottom: rect.y + rect.height,
});
