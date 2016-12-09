/**
 * Helper used to know if the given modifier is enabled
 * @method
 * @memberof Popper.Utils
 * @param {Array} modifiers array of modifiers
 * @param {String} modifierName The name of the modifier to search for
 * @returns {Boolean} Whether or not the requested modifier is enabled
 */
export default function isModifierEnabled(modifiers, modifierName) {
  // arr.some compatible with all browsers ie9+
  return modifiers.some((modifier) => {
    return modifier.name === modifierName && modifier.enabled;
  });
}
