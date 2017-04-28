const nativeHints = [
  'native code',
  '[object MutationObserverConstructor]', // for mobile safari iOS 9.0
];

/**
 * Determine if a function is implemented natively (as opposed to a polyfill).
 * @method
 * @memberof Popper.Utils
 * @argument {Function | undefined} fn the function to check
 * @returns {Boolean}
 */
export default fn =>
  nativeHints.some(hint => (fn || '').toString().indexOf(hint) > -1);
