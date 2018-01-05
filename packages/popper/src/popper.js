import PopperLite from './popper-lite';
import enableEventListeners from './methods/enableEventListeners';
import disableEventListeners from './methods/disableEventListeners';

import Defaults from './methods/defaults';
import placements from './methods/placements';

import additionalModifiers from './modifiers/additionalModifiers';

class Popper extends PopperLite {
  constructor(reference, popper, options) {
    // allow jQuery wrappers
    reference = reference && reference.jquery ? reference[0] : reference;
    popper = popper && popper.jquery ? popper[0] : popper;

    super(reference, popper, options);

    const eventsEnabled = this.options.eventsEnabled;
    if (eventsEnabled) {
      // setup event listeners, they will take care of update the position in specific situations
      this.enableEventListeners();
    }

    this.state.eventsEnabled = eventsEnabled;
  }

  enableEventListeners() {
    return enableEventListeners.call(this);
  }

  disableEventListeners() {
    return disableEventListeners.call(this);
  }

  destroy() {
    super.destroy();

    this.disableEventListeners();
  }

  /**
   * Collection of utilities useful when writing custom modifiers.
   * Starting from version 1.7, this method is available only if you
   * include `popper-utils.js` before `popper.js`.
   *
   * **DEPRECATION**: This way to access PopperUtils is deprecated
   * and will be removed in v2! Use the PopperUtils module directly instead.
   * Due to the high instability of the methods contained in Utils, we can't
   * guarantee them to follow semver. Use them at your own risk!
   * @static
   * @private
   * @type {Object}
   * @deprecated since version 1.8
   * @member Utils
   * @memberof Popper
   */
  static Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;

  static placements = placements;

  static Defaults = {
    ...Defaults,
    modifiers: {
      ...Defaults.modifiers,
      ...additionalModifiers,
    },
  };
}

export default Popper;
