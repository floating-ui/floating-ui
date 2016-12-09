import findIndex from './findIndex';

/**
 * Helper used to know if the given modifier depends from another one.
 * @method
 * @memberof Popper.Utils
 * @param {Array} modifiers array of modifiers
 * @param {String} requesting The modifier that depends on `requested`.
 * @param {String} requested The modifier that must be run before `requesting`.
 * @returns {Boolean} Whether or not `requested` modifier is included before the `requesting`
 * modifier. Both modifiers must also be enabled.
 */
export default function isModifierRequired(modifiers, requesting, requested) {
  const requestedIdx = findIndex(modifiers, (modifier) => {
    return modifier.name === requested && modifier.enabled;
  });
  const requestingIdx = findIndex(modifiers, (modifier) => {
    return modifier.name === requesting && modifier.enabled;
  });

 return requestedIdx >= 0 && requestedIdx < requestingIdx;
}
