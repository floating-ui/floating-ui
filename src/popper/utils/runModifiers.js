import isFunction from './isFunction';
import findIndex from './findIndex';

/**
 * Loop trough the list of modifiers and run them in order,
 * each of them will then edit the data object.
 * @method
 * @memberof Popper.Utils
 * @param {dataObject} data
 * @param {Array} modifiers
 * @param {String} ends - Optional modifier name used as stopper
 * @returns {dataObject}
 */
export default function runModifiers(modifiers, data, ends) {
  const modifiersToRun = ends === undefined
    ? modifiers
    : modifiers.slice(0, findIndex(modifiers, 'name', ends));

  modifiersToRun.forEach(modifier => {
    if (modifier.function) {
      console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
    }
    const fn = modifier.function || modifier.fn;
    if (modifier.enabled && isFunction(fn)) {
      data = fn(data, modifier);
    }
  });

  return data;
}
