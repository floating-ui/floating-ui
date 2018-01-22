/**
 * Tells if you are running Internet Explorer
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean} isIE
 */
let isIE = undefined;

export default function() {
  if (isIE === undefined) {
    isIE = navigator.userAgent.indexOf('Trident') !== -1;
  }
  return isIE;
}
