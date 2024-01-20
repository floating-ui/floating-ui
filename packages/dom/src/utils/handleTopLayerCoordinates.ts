import {
  getComputedStyle,
  getContainingBlock,
  isContainingBlock,
} from '@floating-ui/utils/dom';
import type {ReferenceElement} from '../types';
import {unwrapElement} from './unwrapElement';
import {topLayer} from '../platform/topLayer';

export function handleTopLayerCoordinates({
  x,
  y,
  elements: {reference, floating},
}: {
  x: number;
  y: number;
  elements: {reference: ReferenceElement; floating: HTMLElement};
}) {
  const referenceEl = unwrapElement(reference);

  const [isOnTopLayer, isWithinReference] = topLayer({
    reference: referenceEl,
    floating,
  });

  let offsetX = 0;
  let offsetY = 0;

  if (referenceEl) {
    const root = isWithinReference ? referenceEl : floating;
    const containingBlock = isContainingBlock(root)
      ? root
      : getContainingBlock(root);

    if (isOnTopLayer && containingBlock) {
      const rect = containingBlock.getBoundingClientRect();
      // Margins are not included in the bounding client rect and need to be
      // handled separately.
      const {marginInlineStart = '0', marginBlockStart = '0'} =
        getComputedStyle(containingBlock);
      offsetX = rect.x + parseFloat(marginInlineStart);
      offsetY = rect.y + parseFloat(marginBlockStart);
    }
  }

  const nextX = x + (isOnTopLayer ? offsetX : -offsetX);
  const nextY = y + (isOnTopLayer ? offsetY : -offsetY);

  return {
    x: nextX,
    y: nextY,
  };
}
