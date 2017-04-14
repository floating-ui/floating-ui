import isFunction from './isFunction';
import findIndex from './findIndex';

/**
 * Loop trough the list of modifiers and run them in order, each of them will then edit the data object
 * @method
 * @memberof Popper.Utils
 * @param {Object} data
 * @param {Array} modifiers
 * @param {Function} ends
 */
export default function runModifiers(modifiers, data, ends) {
  const modifiersToRun = ends === undefined
    ? modifiers
    : modifiers.slice(0, findIndex(modifiers, 'name', ends));

  modifiersToRun.forEach(modifier => {
    if (modifier.enabled && isFunction(modifier.function)) {
      data = modifier.function(data, modifier);
    }
  });

  return data;
}
