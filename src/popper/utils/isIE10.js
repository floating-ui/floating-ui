/**
 * Tells if you are running Internet Explorer 10
 * @returns {Boolean} isIE10
 */
export default function() {
  return navigator.appVersion.indexOf('MSIE 10') !== -1;
}
