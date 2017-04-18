// Utils
import debounce from './utils/debounce';
import setStyles from './utils/setStyles';
import getSupportedPropertyName from './utils/getSupportedPropertyName';
import getReferenceOffsets from './utils/getReferenceOffsets';
import getPopperOffsets from './utils/getPopperOffsets';
import isFunction from './utils/isFunction';
import setupEventListeners from './utils/setupEventListeners';
import removeEventListeners from './utils/removeEventListeners';
import runModifiers from './utils/runModifiers';
import isModifierEnabled from './utils/isModifierEnabled';
import computeAutoPlacement from './utils/computeAutoPlacement';
import placements from './utils/placements';

// Modifiers
import modifiers from './modifiers/index';

/**
 *
 * @callback onCreateCallback
 * @param {dataObject} data
 */

/**
 *
 * @callback onUpdateCallback
 * @param {dataObject} data
 */

/**
 * Default options provided to Popper.js constructor.
 * These can be overriden using the `options` argument of Popper.js.
 * To override an option, simply pass as 3rd argument an object with the same
 * structure of {defaults}, example:
 * ```
 * new Popper(ref, pop, {
 *   modifiers: {
 *     preventOverflow: { enabled: false }
 *   }
 * })
 * ```
 * @namespace defaults
 */
const DEFAULTS = {
  /**
   * Popper's placement
   * @memberof defaults
   * @prop {String} placement='bottom'
   */
  placement: 'bottom',

  /**
   * Whether events (resize, scroll) are initially enabled
   * @memberof defaults
   * @prop {Boolean} eventsEnabled=true
   */
  eventsEnabled: true,

  /**
   * Set to true if you want to automatically remove the popper when
   * you call the `destroy` method.
   * @memberof defaults
   * @prop {Boolean} removeOnDestroy=false
   */
  removeOnDestroy: false,

  /**
   * Callback called when the popper is created.
   * By default, is set to no-op.
   * Access Popper.js instance with `data.instance`.
   * @memberof defaults
   * @prop {onCreateCallback}
   */
  onCreate: () => {},

  /**
   * Callback called when the popper is updated, this callback is not called
   * on the initialization/creation of the popper, but only on subsequent
   * updates.
   * By default, is set to no-op.
   * Access Popper.js instance with `data.instance`.
   * @memberof defaults
   * @prop {onUpdateCallback}
   */
  onUpdate: () => {},

  /**
   * List of modifiers used to modify the offsets before they are applied to the popper.
   * They provide most of the functionalities of Popper.js
   * @memberof defaults
   * @prop {modifiers}
   */
  modifiers,
};

/**
 * Create a new Popper.js instance
 * @class Popper
 * @param {HTMLElement|referenceObject} reference - The reference element used to position the popper
 * @param {HTMLElement} popper - The HTML element used as popper.
 * @param {Object} options - Your custom options to override the ones defined in [DEFAULTS](#defaults)
 * @return {Object} instance - The generated Popper.js instance
 */
export default class Popper {
  constructor(reference, popper, options = {}) {
    // make update() debounced, so that it only runs at most once-per-tick
    this.update = debounce(this.update.bind(this));

    // with {} we create a new object with the options inside it
    this.options = { ...Popper.Defaults, ...options };

    // init state
    this.state = {
      isDestroyed: false,
      isCreated: false,
      scrollParents: [],
    };

    // get reference and popper elements (allow jQuery wrappers)
    this.reference = reference.jquery ? reference[0] : reference;
    this.popper = popper.jquery ? popper[0] : popper;

    // make sure to apply the popper position before any computation
    setStyles(this.popper, { position: 'absolute' });

    // refactoring modifiers' list (Object => Array)
    this.modifiers = Object.keys(Popper.Defaults.modifiers).map(name => ({
      name,
      ...Popper.Defaults.modifiers[name],
    }));

    // assign default values to modifiers, making sure to override them with
    // the ones defined by user
    this.modifiers = this.modifiers.map(defaultConfig => {
      const userConfig = (options.modifiers &&
        options.modifiers[defaultConfig.name]) || {};
      return { ...defaultConfig, ...userConfig };
    });

    // add custom modifiers to the modifiers list
    if (options.modifiers) {
      this.options.modifiers = {
        ...{},
        ...Popper.Defaults.modifiers,
        ...options.modifiers,
      };
      Object.keys(options.modifiers).forEach(name => {
        // take in account only custom modifiers
        if (Popper.Defaults.modifiers[name] === undefined) {
          const modifier = options.modifiers[name];
          modifier.name = name;
          this.modifiers.push(modifier);
        }
      });
    }

    // sort the modifiers by order
    this.modifiers = this.modifiers.sort((a, b) => a.order - b.order);

    // modifiers have the ability to execute arbitrary code when Popper.js get inited
    // such code is executed in the same order of its modifier
    // they could add new properties to their options configuration
    // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
    this.modifiers.forEach(modifierOptions => {
      if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
        modifierOptions.onLoad(
          this.reference,
          this.popper,
          this.options,
          modifierOptions,
          this.state
        );
      }
    });

    // fire the first update to position the popper in the right place
    this.update();

    const eventsEnabled = this.options.eventsEnabled;
    if (eventsEnabled) {
      // setup event listeners, they will take care of update the position in specific situations
      this.enableEventListeners();
    }

    this.state.eventsEnabled = eventsEnabled;
  }

  //
  // Methods
  //

  /**
     * Updates the position of the popper, computing the new offsets and applying the new style
     * Prefer `scheduleUpdate` over `update` because of performance reasons
     * @method
     * @memberof Popper
     */
  update() {
    // if popper is destroyed, don't perform any further update
    if (this.state.isDestroyed) {
      return;
    }

    let data = {
      instance: this,
      styles: {},
      attributes: {},
      flipped: false,
      offsets: {},
    };

    // compute reference element offsets
    data.offsets.reference = getReferenceOffsets(
      this.state,
      this.popper,
      this.reference
    );

    // compute auto placement, store placement inside the data object,
    // modifiers will be able to edit `placement` if needed
    // and refer to originalPlacement to know the original value
    data.placement = computeAutoPlacement(
      this.options.placement,
      data.offsets.reference,
      this.popper,
      this.reference
    );

    // store the computed placement inside `originalPlacement`
    data.originalPlacement = this.options.placement;

    // compute the popper offsets
    data.offsets.popper = getPopperOffsets(
      this.state,
      this.popper,
      data.offsets.reference,
      data.placement
    );

    // run the modifiers
    data = runModifiers(this.modifiers, data);

    // the first `update` will call `onCreate` callback
    // the other ones will call `onUpdate` callback
    if (!this.state.isCreated) {
      this.state.isCreated = true;
      this.options.onCreate(data);
    } else {
      this.options.onUpdate(data);
    }
  }

  /**
     * Schedule an update, it will run on the next UI update available
     * @method scheduleUpdate
     * @memberof Popper
     */
  scheduleUpdate = () => requestAnimationFrame(this.update);

  /**
     * Destroy the popper
     * @method
     * @memberof Popper
     */
  destroy() {
    this.state.isDestroyed = true;

    // touch DOM only if `applyStyle` modifier is enabled
    if (isModifierEnabled(this.modifiers, 'applyStyle')) {
      this.popper.removeAttribute('x-placement');
      this.popper.style.left = '';
      this.popper.style.position = '';
      this.popper.style.top = '';
      this.popper.style[getSupportedPropertyName('transform')] = '';
    }

    this.disableEventListeners();

    // remove the popper if user explicity asked for the deletion on destroy
    // do not use `remove` because IE11 doesn't support it
    if (this.options.removeOnDestroy) {
      this.popper.parentNode.removeChild(this.popper);
    }
    return this;
  }

  /**
     * it will add resize/scroll events and start recalculating
     * position of the popper element when they are triggered
     * @method
     * @memberof Popper
     */
  enableEventListeners() {
    if (!this.state.eventsEnabled) {
      this.state = setupEventListeners(
        this.reference,
        this.options,
        this.state,
        this.scheduleUpdate
      );
    }
  }

  /**
     * it will remove resize/scroll events and won't recalculate
     * popper position when they are triggered. It also won't trigger onUpdate callback anymore,
     * unless you call 'update' method manually.
     * @method
     * @memberof Popper
     */
  disableEventListeners() {
    if (this.state.eventsEnabled) {
      window.cancelAnimationFrame(this.scheduleUpdate);
      this.state = removeEventListeners(this.reference, this.state);
    }
  }

  /**
     * Collection of utilities useful when writing custom modifiers.
     * Starting from version 1.7, this method is available only if you
     * include `popper-utils.js` before `popper.js`.
     * @memberof Popper
     */
  static Utils = window.PopperUtils;

  /**
     * List of accepted placements to use as values of the `placement` option
     * @memberof Popper
     */
  static placements = placements;

  /**
     * Default Popper.js options
     * @memberof Popper
     */
  static Defaults = DEFAULTS;
}

/**
  * The `referenceObject` is an object that provides an interface compatible with Popper.js
  * and lets you use it as replacement of a real DOM node.
  * You can use this method to position a popper relatively to a set of coordinates
  * in case you don't have a DOM node to use as reference.
  * NB: This feature isn't supported in Internet Explorer 10
  * @name referenceObject
  * @property {Function} data.getBoundingClientRect A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
  * @property {Number} data.clientWidth An ES6 getter that will return the width of the virtual reference element.
  * @property {Number} data.clientHeight An ES6 getter that will return the height of the virtual reference element.
  */
