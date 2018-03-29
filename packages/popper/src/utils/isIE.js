/**
 * Determines if the browser is Internet Explorer
 * @method
 * @memberof Popper.Utils
 * @param {Number} version to check
 * @returns {Boolean} isIE
 */
export default (() => {
  const ua = navigator.userAgent;
  const isIE11 = /Trident/.test(ua);
  const isIE10 = /MSIE 10/.test(ua);

  return (version = 'all') => {
    if (version === 'all') {
      return isIE11 || isIE10;
    }
    if (version === 11) {
      return isIE11;
    }
    if (version === 10) {
      return isIE10;
    }
    return false;
  };
})();
