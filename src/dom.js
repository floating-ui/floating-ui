// @flow
import type {
  PositioningStrategy,
  Platform,
  Rect,
  ClientRectObject,
  Window,
  ElementRects,
  VirtualElement,
  Dimensions,
} from './types';
import type { Boundary, RootBoundary } from './enums';
import getRectRelativeToOffsetParent from './dom-utils/getRectRelativeToOffsetParent';
import getOffsetParent from './dom-utils/getOffsetParent';
import getClippingClientRect from './dom-utils/getClippingClientRect';
import convertOffsetParentRelativeRectToViewportRelativeRect from './dom-utils/convertOffsetParentRelativeRectToViewportRelativeRect';
import getDocumentElement from './dom-utils/getDocumentElement';
import getDimensions from './dom-utils/getDimensions';
import { isElement } from './dom-utils/instanceOf';

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

const convertOffsetParentRelativeRectToViewportRelativeRectPromise: ConvertOffsetParentRelativeRectToViewportRelativeRect = (
  args
) =>
  Promise.resolve(convertOffsetParentRelativeRectToViewportRelativeRect(args));

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
  convertOffsetParentRelativeRectToViewportRelativeRect: convertOffsetParentRelativeRectToViewportRelativeRectPromise,
  getDocumentElement: getDocumentElementPromise,
  getOffsetParent: getOffsetParentPromise,
  getDimensions: getDimensionsPromise,
};
