// Utils
import debounce from './utils/debounce';
import setStyles from './utils/setStyles';
import isFunction from './utils/isFunction';

// Methods
import update from './methods/update';
import destroy from './methods/destroy';
import enableEventListeners from './methods/enableEventListeners';
import disableEventListeners from './methods/disableEventListeners';
import DEFAULTS from './methods/defaults';
import placements from './methods/placements';

export default class Popper {
  /**
   * Create a new Popper.js instance
   * @class Popper
   * @param {HTMLElement|referenceObject} reference - The reference element used to position the popper
   * @param {HTMLElement} popper - The HTML element used as popper.
   * @param {Object} options - Your custom options to override the ones defined in [DEFAULTS](#defaults)
   * @return {Object} instance - The generated Popper.js instance
   */
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

  // We can't use class properties because they don't get listed in the
  // class prototype and break stuff like Sinon stubs
  update() { return update.call(this); }
  destroy() { return destroy.call(this); }
  enableEventListeners() { return enableEventListeners.call(this); }
  disableEventListeners() { return disableEventListeners.call(this); }

  /**
   * Schedule an update, it will run on the next UI update available
   * @method scheduleUpdate
   * @memberof Popper
   */
  scheduleUpdate = () => requestAnimationFrame(this.update);

  /**
   * Collection of utilities useful when writing custom modifiers.
   * Starting from version 1.7, this method is available only if you
   * include `popper-utils.js` before `popper.js`.
   *
   * **DEPRECATION**: This way to access PopperUtils is deprecated
   * and will be removed in v2! Use the PopperUtils module directly instead.
   * @static
   * @type {Object}
   * @deprecated since version 1.8
   * @member Utils
   * @memberof Popper
   */
  static Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;

  static placements = placements;

  static Defaults = DEFAULTS;
}

/**
 * The `referenceObject` is an object that provides an interface compatible with Popper.js
 * and lets you use it as replacement of a real DOM node.<br />
 * You can use this method to position a popper relatively to a set of coordinates
 * in case you don't have a DOM node to use as reference.
 *
 * ```
 * new Popper(referenceObject, popperNode);
 * ```
 *
 * NB: This feature isn't supported in Internet Explorer 10
 * @name referenceObject
 * @property {Function} data.getBoundingClientRect
 * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
 * @property {number} data.clientWidth
 * An ES6 getter that will return the width of the virtual reference element.
 * @property {number} data.clientHeight
 * An ES6 getter that will return the height of the virtual reference element.
 */
