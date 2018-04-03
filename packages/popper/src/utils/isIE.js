import isBrowser from './isBrowser'

const ua = isBrowser && navigator.userAgent;
const isIE11 = /Trident/.test(ua);
const isIE10 = /MSIE 10/.test(ua);

/**
 * Determines if the browser is Internet Explorer
 * @method
 * @memberof Popper.Utils
 * @param {Number} version to check
 * @returns {Boolean} isIE
 */
export default function isIE(version) {
  if (version === 11) {
    return isIE11;
  }
  if (version === 10) {
    return isIE10;
  }
  return isIE11 || isIE10;
}
