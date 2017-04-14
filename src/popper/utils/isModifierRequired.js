import find from './find';

/**
 * Helper used to know if the given modifier depends from another one.
 * It checks if the needed modifier is listed and enabled.
 * @method
 * @memberof Popper.Utils
 * @param {Array} modifiers - list of modifiers
 * @param {String} requestingName - name of requesting modifier
 * @param {String} requestedName - name of requested modifier
 * @returns {Boolean}
 */
export default function isModifierRequired(
  modifiers,
  requestingName,
  requestedName
) {
  const requesting = find(modifiers, ({ name }) => name === requestingName);

  return (
    !!requesting &&
    modifiers.some(modifier => {
      return (
        modifier.name === requestedName &&
        modifier.enabled &&
        modifier.order < requesting.order
      );
    })
  );
}
