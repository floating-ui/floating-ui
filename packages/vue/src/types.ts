import type {
  FloatingElement,
  Middleware,
  MiddlewareData,
  Padding,
  Placement,
  ReferenceElement,
  Strategy,
} from '@floating-ui/dom';
import type {ComponentPublicInstance, Ref} from 'vue-demi';

export type {
  AlignedPlacement,
  Alignment,
  AutoPlacementOptions,
  AutoUpdateOptions,
  Axis,
  Boundary,
  ClientRectObject,
  ComputePositionConfig,
  ComputePositionReturn,
  Coords,
  DetectOverflowOptions,
  Dimensions,
  ElementContext,
  ElementRects,
  Elements,
  FlipOptions,
  FloatingElement,
  HideOptions,
  InlineOptions,
  Length,
  Middleware,
  MiddlewareArguments,
  MiddlewareData,
  MiddlewareReturn,
  MiddlewareState,
  NodeScroll,
  OffsetOptions,
  Padding,
  Placement,
  Platform,
  Rect,
  ReferenceElement,
  RootBoundary,
  ShiftOptions,
  Side,
  SideObject,
  SizeOptions,
  Strategy,
  VirtualElement,
} from '@floating-ui/dom';

export type MaybeReadonlyRef<T> = T | Readonly<Ref<T>>;

export type MaybeReadonlyRefOrGetter<T> = MaybeReadonlyRef<T> | (() => T);

export type MaybeElement<T> = T | ComponentPublicInstance | null | undefined;

export type UseFloatingOptions<T extends ReferenceElement = ReferenceElement> =
  {
    /**
     * Represents the open/close state of the floating element.
     * @default true
     */
    open?: MaybeReadonlyRefOrGetter<boolean | undefined>;
    /**
     * Where to place the floating element relative to its reference element.
     * @default 'bottom'
     */
    placement?: MaybeReadonlyRefOrGetter<Placement | undefined>;
    /**
     * The type of CSS position property to use.
     * @default 'absolute'
     */
    strategy?: MaybeReadonlyRefOrGetter<Strategy | undefined>;
    /**
     * These are plain objects that modify the positioning coordinates in some fashion, or provide useful data for the consumer to use.
     * @default undefined
     */
    middleware?: MaybeReadonlyRefOrGetter<Middleware[] | undefined>;
    /**
     * Whether to use `transform` instead of `top` and `left` styles to
     * position the floating element (`floatingStyles`).
     * @default true
     */
    transform?: MaybeReadonlyRefOrGetter<boolean | undefined>;
    /**
     * Callback to handle mounting/unmounting of the elements.
     * @default undefined
     */
    whileElementsMounted?: (
      reference: T,
      floating: FloatingElement,
      update: () => void,
    ) => () => void;
  };

export type UseFloatingReturn = {
  /**
   * The x-coord of the floating element.
   */
  x: Readonly<Ref<number>>;
  /**
   * The y-coord of the floating element.
   */
  y: Readonly<Ref<number>>;
  /**
   * The stateful placement, which can be different from the initial `placement` passed as options.
   */
  placement: Readonly<Ref<Placement>>;
  /**
   * The type of CSS position property to use.
   */
  strategy: Readonly<Ref<Strategy>>;
  /**
   * Additional data from middleware.
   */
  middlewareData: Readonly<Ref<MiddlewareData>>;
  /**
   * The boolean that let you know if the floating element has been positioned.
   */
  isPositioned: Readonly<Ref<boolean>>;
  /**
   * CSS styles to apply to the floating element to position it.
   */
  floatingStyles: Readonly<
    Ref<{
      position: Strategy;
      top: string;
      left: string;
      transform?: string;
      willChange?: string;
    }>
  >;
  /**
   * The function to update floating position manually.
   */
  update: () => void;
};

export type ArrowOptions = {
  /**
   * The arrow element or template ref to be positioned.
   * @required
   */
  element: MaybeReadonlyRefOrGetter<MaybeElement<Element>>;
  /**
   * The padding between the arrow element and the floating element edges. Useful when the floating element has rounded corners.
   * @default 0
   */
  padding?: Padding;
};
