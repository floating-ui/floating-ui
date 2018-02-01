/**
 * Tells if you are running Internet Explorer
 * @method
 * @memberof Popper.Utils
 * @argument {number} version to check
 * @returns {Boolean} isIE
 */
const cache = {};

export default function (version = 'all') {
  version = version.toString();
  if(cache.hasOwnProperty(version)){
    return cache[version];
  }
  switch (version) {
    case '11':
      cache[version] = navigator.userAgent.indexOf('Trident') !== -1;
      break;
    case '10':
      cache[version] = navigator.appVersion.indexOf('MSIE 10') !== -1;
      break;
    case 'all':
      cache[version] = navigator.userAgent.indexOf('Trident') !== -1 || navigator.userAgent.indexOf('MSIE') !== -1;
      break;
  }

  //Set IE
  cache.all = cache.all || Object.keys(cache).some(key => cache[key]);
  return cache[version];
}
