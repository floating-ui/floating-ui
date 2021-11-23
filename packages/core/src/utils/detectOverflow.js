// @flow
import type { SideObject, Padding, ModifierArguments } from '../types';
import type { Boundary, RootBoundary, Context } from '../enums';
import rectToClientRect from './rectToClientRect';
import {
  clippingParents,
  reference,
  popper,
  basePlacements,
  viewport,
} from '../enums';
import mergePaddingObject from './mergePaddingObject';
import expandToHashMap from './expandToHashMap';

export type Options = {|
  boundary: Boundary,
  rootBoundary: RootBoundary,
  elementContext: Context,
  altBoundary: boolean,
  padding: Padding,
|};

export default async function detectOverflow(
  modifierArguments: ModifierArguments,
  options: $Shape<Options> = {}
): Promise<SideObject> {
  const { x, y, platform, rects, elements, strategy } = modifierArguments;

  const {
    boundary = clippingParents,
    rootBoundary = viewport,
    elementContext = popper,
    altBoundary = false,
    padding = 0,
  } = options;

  const paddingObject = mergePaddingObject(
    typeof padding !== 'number'
      ? padding
      : expandToHashMap(padding, basePlacements)
  );

  const altContext = elementContext === popper ? reference : popper;
  const element = elements[altBoundary ? altContext : elementContext];

  const clippingClientRect = await platform.getClippingClientRect({
    element: (await platform.isElement(element))
      ? element
      : element.contextElement ||
        (await platform.getDocumentElement({ element: elements.popper })),
    boundary,
    rootBoundary,
  });

  const elementClientRect = rectToClientRect(
    await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
      rect:
        elementContext === popper ? { ...rects.popper, x, y } : rects.reference,
      offsetParent: await platform.getOffsetParent({
        element: elements.popper,
      }),
      strategy,
    })
  );

  // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect
  return {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom:
      elementClientRect.bottom -
      clippingClientRect.bottom +
      paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right:
      elementClientRect.right - clippingClientRect.right + paddingObject.right,
  };
}
