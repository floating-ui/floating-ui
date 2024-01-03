import type {Rect} from '@floating-ui/utils';

export function paintDebugRects(elementRect: Rect, clippingRect: Rect) {
  const elNode = document.getElementById('elementRect') as HTMLElement;
  elNode.style.left = `${elementRect.x}px`;
  elNode.style.top = `${elementRect.y}px`;
  elNode.style.width = `${elementRect.width}px`;
  elNode.style.height = `${elementRect.height}px`;

  const clNode = document.getElementById('clippingRect') as HTMLElement;
  clNode.style.left = `${clippingRect.x}px`;
  clNode.style.top = `${clippingRect.y}px`;
  clNode.style.width = `${clippingRect.width}px`;
  clNode.style.height = `${clippingRect.height}px`;
}
