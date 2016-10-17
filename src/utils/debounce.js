const longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
let timeoutDuration = 0;
for (let i = 0; i < longerTimeoutBrowsers.length; i += 1) {
  if (navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
    timeoutDuration = 1;
    break;
  }
}

function microtaskDebounce(fn) {
  let called = false;
  let i = 0;
  const elem = document.createElement('span');
  const observer = new MutationObserver(() => {
    fn();
    called = false;
  });

  observer.observe(elem, { childList: true });

  return () => {
    if (!called) {
      called = true;
      elem.textContent = `${i}`;
      i += 1;
    }
  };
}

function taskDebounce(fn) {
  let called = false;
  return () => {
    if (!called) {
      called = true;
      setTimeout(() => {
        called = false;
        fn();
      }, timeoutDuration);
    }
  };
}

/**
 * Create a debounced version of a method, that's asynchronously deferred
 * but called in the minimum time possible.
 *
 * @method
 * @memberof Popper.Utils
 * @argument {Function} fn
 * @returns {Function}
 */
export default window.MutationObserver ? microtaskDebounce : taskDebounce;
