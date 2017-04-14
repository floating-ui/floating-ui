const nativeHints = [
  'native code',
  '[object MutationObserverConstructor]', // for mobile safari iOS 9.0
];

/**
 * Determine if a function is implemented natively (as opposed to a polyfill).
 * @argument {Function | undefined} fn the function to check
 * @returns {boolean}
 */
export default fn =>
  nativeHints.some(hint => (fn || '').toString().indexOf(hint) > -1);
