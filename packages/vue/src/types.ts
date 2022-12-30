import type {ComponentPublicInstance, ComputedRef, Ref} from 'vue-demi';
import type {
  ReferenceElement,
  FloatingElement,
  Placement,
  Strategy,
  Middleware,
  MiddlewareData,
  Padding,
} from '@floating-ui/dom';

export * from '.';

export type MaybeReadonlyRef<T> = T | Readonly<Ref<T> | ComputedRef<T>>;

export type MaybeElement<T> = T | ComponentPublicInstance | null | undefined;

export type UseFloatingOptions<T extends ReferenceElement = ReferenceElement> =
  {
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
