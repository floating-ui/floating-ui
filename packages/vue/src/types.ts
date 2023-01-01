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

export * from '.';

export type MaybeReadonlyRef<T> = T | Readonly<Ref<T>>;

export type MaybeElement<T> = T | ComponentPublicInstance | null | undefined;

export type UseFloatingOptions<T extends ReferenceElement = ReferenceElement> =
  {
    /**
     * Represents the open/close state of the floating element.
     * @default true
     */
    open?: MaybeReadonlyRef<boolean | undefined>;
    /**
     * Where to place the floating element relative to its reference element.
     * @default 'bottom'
     */
    placement?: MaybeReadonlyRef<Placement | undefined>;
    /**
     * The type of CSS position property to use.
     * @default 'absolute'
     */
    strategy?: MaybeReadonlyRef<Strategy | undefined>;
    /**
     * These are plain objects that modify the positioning coordinates in some fashion, or provide useful data for the consumer to use.
     * @default undefined
     */
    middleware?: MaybeReadonlyRef<Middleware[] | undefined>;
    /**
     * Callback to handle mounting/unmounting of the elements.
     * @default undefined
     */
    whileElementsMounted?: (
      reference: T,
      floating: FloatingElement,
      update: () => void
    ) => void | (() => void);
  };

export type UseFloatingReturn = {
  /**
   * The x-coord of the floating element.
   */
  x: Readonly<Ref<number | null>>;
  /**
   * The y-coord of the floating element.
   */
  y: Readonly<Ref<number | null>>;
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
   * The function to update floating position manually.
   */
  update: () => void;
};

export type ArrowOptions = {
  /**
   * The arrow element or template ref to be positioned.
   * @required
   */
  element: MaybeReadonlyRef<MaybeElement<HTMLElement>>;
  /**
   * The padding between the arrow element and the floating element edges. Useful when the floating element has rounded corners.
   * @default 0
   */
  padding?: Padding;
};
