const isBrowser = typeof window !== 'undefined';
let supportsMutationObserver = false;

(function () {
  if (!isBrowser || !window.MutationObserver) {
    return;
  }
  const target = document.createElement('div');
  const observer = new window.MutationObserver(function() {
    supportsMutationObserver = true;
  });
  observer.observe(target, { attributes: true });
  target.setAttribute('id', 'popper.js');
})();

export default function () {
  return supportsMutationObserver;
};
