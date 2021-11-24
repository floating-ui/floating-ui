// @flow
import type {
  PositioningStrategy,
  Platform,
  Dimensions,
  VirtualElement,
  ElementRects,
  ClientRectObject,
  Rect,
} from '@popperjs/core/src/types';
import type { Boundary, RootBoundary } from '@popperjs/core/src/enums';
import type { Window } from './types';

import getRectRelativeToOffsetParent from './utils/getRectRelativeToOffsetParent';
import getOffsetParent from './utils/getOffsetParent';
import getClippingClientRect from './utils/getClippingClientRect';
import convertOffsetParentRelativeRectToViewportRelativeRect from './utils/convertOffsetParentRelativeRectToViewportRelativeRect';
import getDocumentElement from './utils/getDocumentElement';
import getDimensions from './utils/getDimensions';
import { isElement } from './utils/instanceOf';

type GetElementRects = ({
  reference: Element | VirtualElement,
  popper: HTMLElement,
  strategy: PositioningStrategy,
}) => Promise<ElementRects>;

type GetClippingClientRect = ({
  element: Element,
  boundary: Boundary,
  rootBoundary: RootBoundary,
}) => Promise<ClientRectObject>;

type ConvertOffsetParentRelativeRectToViewportRelativeRect = ({
  rect: Rect,
  offsetParent: Element | Window,
  strategy: PositioningStrategy,
}) => Promise<Rect>;

type GetDocumentElement = ({ element: Element }) => Promise<Element>;
type GetOffsetParent = ({ element: Element }) => Promise<Element | Window>;
type GetDimensions = ({ element: HTMLElement }) => Promise<Dimensions>;
type IsElement = (value: any) => Promise<boolean>;

const getElementRectsPromise: GetElementRects = ({
  reference,
  popper,
  strategy,
}) =>
  Promise.resolve({
    reference: getRectRelativeToOffsetParent(
      reference,
      getOffsetParent(popper),
      strategy
    ),
    popper: { ...getDimensions(popper), x: 0, y: 0 },
  });

const getClippingClientRectPromise: GetClippingClientRect = (args) =>
  Promise.resolve(getClippingClientRect(args));

const convertOffsetParentRelativeRectToViewportRelativeRectPromise: ConvertOffsetParentRelativeRectToViewportRelativeRect =
  (args) =>
    Promise.resolve(
      convertOffsetParentRelativeRectToViewportRelativeRect(args)
    );

const getOffsetParentPromise: GetOffsetParent = ({ element }) =>
  Promise.resolve(getOffsetParent(element));

const getDocumentElementPromise: GetDocumentElement = ({ element }) =>
  Promise.resolve(getDocumentElement(element));

const getDimensionsPromise: GetDimensions = ({ element }) =>
  Promise.resolve(getDimensions(element));

const isElementPromise: IsElement = (value) =>
  Promise.resolve(isElement(value));

export const platform: Platform = {
  isElement: isElementPromise,
  getElementRects: getElementRectsPromise,
  getClippingClientRect: getClippingClientRectPromise,
  convertOffsetParentRelativeRectToViewportRelativeRect:
    convertOffsetParentRelativeRectToViewportRelativeRectPromise,
  getDocumentElement: getDocumentElementPromise,
  getOffsetParent: getOffsetParentPromise,
  getDimensions: getDimensionsPromise,
};
