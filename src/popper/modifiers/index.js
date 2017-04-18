import applyStyle, { applyStyleOnLoad } from './applyStyle';
import arrow from './arrow';
import flip from './flip';
import keepTogether from './keepTogether';
import offset from './offset';
import preventOverflow from './preventOverflow';
import shift from './shift';
import hide from './hide';
import inner from './inner';

/**
 * Modifiers are plugins used to alter the behavior of your poppers.
 * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
 * needed by the library.
 *
 * Usually you don't want to override the `order`, `function` and `onLoad` props.
 * All the other properties are configurations that could be tweaked.
 * @namespace modifiers
 */
export default {
  /**
   * Modifier used to shift the popper on the start or end of its reference element side
   * @memberof modifiers
   * @inner
   */
  shift: {
    /** @prop {Number} order=100 - Index used to define the order of execution */
    order: 100,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {Function} */
    function: shift,
  },

  /**
   * Modifier used to add an offset to the popper, useful if you more granularity positioning your popper.
   * The offsets will shift the popper on the side of its reference element.
   * @memberof modifiers
   * @inner
   */
  offset: {
    /** @prop {Number} order=200 - Index used to define the order of execution */
    order: 200,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {Function} */
    function: offset,
    /** @prop {Number|String} offset=0
     * Basic usage allows a number used to nudge the popper by the given amount of pixels.
     * You can pass a percentage value as string (eg. `20%`) to nudge by the given percentage (relative to reference element size)
     * Other supported units are `vh` and `vw` (relative to viewport)
     * Additionally, you can pass a pair of values (eg. `10 20` or `2vh 20%`) to nudge the popper
     * on both axis.
     * A note about percentage values, if you want to refer a percentage to the popper size instead of the reference element size,
     * use `%p` instead of `%` (eg: `20%p`). To make it clearer, you can replace `%` with `%r` and use eg.`10%p 25%r`.
     * **Heads up!** The order of the axis is relative to the popper placement: `bottom` or `top` are `X,Y`, the other are `Y,X`
     */
    offset: 0,
  },

  /**
   * Modifier used to prevent the popper from being positioned outside the boundary.
   *
   * A scenario exists where the reference itself is not within the boundaries. We can
   * say it has "escaped the boundaries" — or just "escaped". In this case we need to
   * decide whether the popper should either:
   *
   * - detach from the reference and remain "trapped" in the boundaries, or
   * - if it should be ignore the boundary and "escape with the reference"
   *
   * When `escapeWithReference` is `true`, and reference is completely outside the
   * boundaries, the popper will overflow (or completely leave) the boundaries in order
   * to remain attached to the edge of the reference.
   * @memberof modifiers
   * @inner
   */
  preventOverflow: {
    /** @prop {Number} order=300 - Index used to define the order of execution */
    order: 300,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {Function} */
    function: preventOverflow,
    /**
     * @prop {Array} priority=['left', 'right', 'top', 'bottom']
     * Popper will try to prevent overflow following these priorities by default,
     * then, it could overflow on the left and on top of the `boundariesElement`
     */
    priority: ['left', 'right', 'top', 'bottom'],
    /**
     * @prop {Number} padding=5
     * Amount of pixel used to define a minimum distance between the boundaries
     * and the popper this makes sure the popper has always a little padding
     * between the edges of its container
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='scrollParent'
     * Boundaries used by the modifier, can be `scrollParent`, `window`,
     * `viewport` or any DOM element.
     */
    boundariesElement: 'scrollParent',
  },

  /**
   * Modifier used to make sure the reference and its popper stay near eachothers
   * without leaving any gap between the two. Expecially useful when the arrow is
   * enabled and you want to assure it to point to its reference element.
   * It cares only about the first axis, you can still have poppers with margin
   * between the popper and its reference element.
   * @memberof modifiers
   * @inner
   */
  keepTogether: {
    /** @prop {Number} order=400 - Index used to define the order of execution */
    order: 400,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {Function} */
    function: keepTogether,
  },

  /**
   * Modifier used to move the `arrowElement` on the edge of the popper to make
   * sure it's always between the popper and its reference element.
   * It will use the CSS outer size of the `arrowElement` element to know how
   * many pixels of conjuction are needed.
   * @memberof modifiers
   * @inner
   */
  arrow: {
    /** @prop {Number} order=500 - Index used to define the order of execution */
    order: 500,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {Function} */
    function: arrow,
    /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
    element: '[x-arrow]',
  },

  /**
   * Modifier used to flip the placement of the popper when the latter starts
   * overlapping its reference element.
   * Requires the `preventOverflow` modifier before it in order to work.
   * **NOTE:** this modifier will run all its previous modifiers everytime it
   * tries to flip the popper!
   * @memberof modifiers
   * @inner
   */
  flip: {
    /** @prop {Number} order=600 - Index used to define the order of execution */
    order: 600,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {Function} */
    function: flip,
    /**
     * @prop {String|Array} behavior='flip'
     * The behavior used to change the popper's placement. It can be one of
     * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
     * placements (with optional variations).
     */
    behavior: 'flip',
    /**
     * @prop {Number} padding=5
     * The popper will flip if it hits the edges of the `boundariesElement`
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='viewport'
     * The element which will define the boundaries of the popper position,
     * the popper will never be placed outside of the defined boundaries
     * (except if keepTogether is enabled)
     */
    boundariesElement: 'viewport',
  },

  /**
   * Modifier used to make the popper flow toward the inner of the reference element.
   * By default, when this modifier is disabled, the popper will be placed outside
   * the reference element.
   * @memberof modifiers
   * @inner
   */
  inner: {
    /** @prop {Number} order=700 - Index used to define the order of execution */
    order: 700,
    /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
    enabled: false,
    /** @prop {Function} */
    function: inner,
  },

  /**
   * Modifier used to hide the popper when its reference element is outside of the
   * popper boundaries. It will set an x-hidden attribute which can be used to hide
   * the popper when its reference is out of boundaries.
   * @memberof modifiers
   * @inner
   */
  hide: {
    /** @prop {Number} order=800 - Index used to define the order of execution */
    order: 800,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {Function} */
    function: hide,
  },

  /**
   * Applies the computed styles to the popper element, disabling this modifier,
   * no DOM changes will be performed by Popper.js. You may want to disble it
   * while working with view librararies like React.
   * @memberof modifiers
   * @inner
   */
  applyStyle: {
    /** @prop {Number} order=900 - Index used to define the order of execution */
    order: 900,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {Function} */
    function: applyStyle,
    /** @prop {Function} */
    onLoad: applyStyleOnLoad,
    /**
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3d transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties.
     */
    gpuAcceleration: true,
  },
};

/**
 * Modifiers can edit the `data` object to change the beheavior of the popper.
 * This object contains all the informations used by Popper.js to compute the
 * popper position.
 * The modifier can edit the data as needed, and then `return` it as result.
 *
 * @callback Modifiers~modifier
 * @param {dataObject} data
 * @return {dataObject} modified data
 */

/**
 * The `dataObject` is an object containing all the informations used by Popper.js
 * this object get passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
 * @name dataObject
 * @property {Object} data.instance The Popper.js instance
 * @property {String} data.placement Placement applied to popper
 * @property {String} data.originalPlacement Placement originally defined on init
 * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
 * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper.
 * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
 * @property {Object} data.styles Any CSS property defined here will be applied to the popper, it expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.boundaries Offsets of the popper boundaries
 * @property {Object} data.offsets The measurements of popper, reference and arrow elements.
 * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.arro] `top` and `left` offsets, only one of them will be different from 0
 */
