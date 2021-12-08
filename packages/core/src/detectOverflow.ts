import type {
  SideObject,
  Padding,
  Boundary,
  RootBoundary,
  ElementContext,
  MiddlewareArguments,
} from './types';
import {getSideObjectFromPadding} from './utils/getPaddingObject';
import {rectToClientRect} from './utils/rectToClientRect';

export type Options = {
  boundary: Boundary;
  rootBoundary: RootBoundary;
  elementContext: ElementContext;
  altBoundary: boolean;
  padding: Padding;
};

export async function detectOverflow(
  middlewareArguments: MiddlewareArguments,
  options: Partial<Options> = {}
): Promise<SideObject> {
  const {x, y, platform, rects, elements, strategy} = middlewareArguments;

  const {
    boundary = 'clippingParents',
    rootBoundary = 'viewport',
    elementContext = 'floating',
    altBoundary = false,
    padding = 0,
  } = options;

  const paddingObject = getSideObjectFromPadding(padding);
  const altContext = elementContext === 'floating' ? 'reference' : 'floating';
  const element = elements[altBoundary ? altContext : elementContext];

  const clippingClientRect = await platform.getClippingClientRect({
    element: (await platform.isElement(element))
      ? element
      : element.contextElement ||
        (await platform.getDocumentElement({element: elements.floating})),
    boundary,
    rootBoundary,
  });

  const elementClientRect = rectToClientRect(
    await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
      rect:
        elementContext === 'floating'
          ? {...rects.floating, x, y}
          : rects.reference,
      offsetParent: await platform.getOffsetParent({
        element: elements.floating,
      }),
      strategy,
    })
  );

  // Debug the client rects:
  // draw(clippingClientRect, 'cyan', 1);
  // draw(elementClientRect, 'yellow', 2);

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

// function draw(rect, color, id) {
//   const lastDraw = document.querySelector(`#draw-${id}`);

//   if (document.body.contains(lastDraw)) {
//     document.body.removeChild(lastDraw);
//   }

//   const div = document.createElement('div');
//   div.id = `draw-${id}`;

//   Object.assign(div.style, {
//     position: 'absolute',
//     left: `${rect.x}px`,
//     top: `${rect.y}px`,
//     width: `${rect.width}px`,
//     height: `${rect.height}px`,
//     backgroundColor: color,
//     opacity: '0.5',
//   });

//   document.body.append(div);
// }
