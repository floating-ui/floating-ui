// @flow
import type { SideObject, Padding, Window, ModifierArguments } from '../types';
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

// eslint-disable-next-line import/no-unused-modules
export type Options = {|
  boundary: Boundary,
  rootBoundary: RootBoundary,
  elementContext: Context,
  altBoundary: boolean,
  padding: Padding,
|};

let element;
let isAppended = false;

// Draw the clipping rect on the screen for debugging purposes
// eslint-disable-next-line unused-imports/no-unused-vars
function draw(rect, parent: ?(Element | Window)) {
  if (isAppended) {
    Object.assign(element.style, {
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      top: `${rect.y}px`,
      left: `${rect.x}px`,
    });

    return;
  }

  element = document.createElement('div');
  Object.assign(element.style, {
    position: 'absolute',
    backgroundColor: 'yellow',
    opacity: '0.3',
    pointerEvents: 'none',
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    top: `${rect.y}px`,
    left: `${rect.x}px`,
  });

  if (parent?.toString() === '[object Window]') {
    parent = document.body;
  }

  // $FlowIgnore[prop-missing] checked above
  parent?.appendChild(element);

  isAppended = true;
}

export default async function detectOverflow(
  modifierArguments: ModifierArguments,
  options: $Shape<Options> = {}
): Promise<SideObject> {
  const { platform, rects, coords, elements, strategy } = modifierArguments;

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
        elementContext === popper
          ? { ...rects.popper, ...coords }
          : rects.reference,
      offsetParent: await platform.getOffsetParent({
        element: elements.popper,
      }),
      strategy,
    })
  );

  if (__DEV__) {
    // draw(elementClientRect, document.body);
    // draw(clippingClientRect, document.body);
  }

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
