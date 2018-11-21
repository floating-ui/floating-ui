import getScrollParent from './getScrollParent';
import getWindow from './getWindow';

/**
 * @method
 * @argument {Element} scrollParent
 * @argument {String} event
 * @argument {EventListenerOrEventListenerObject} callback
 * @argument {Element[]} scrollParents
 * @private
 */
function attachToScrollParents(scrollParent, event, callback, scrollParents) {
  const isBody = scrollParent.nodeName.toUpperCase() === 'BODY';
  const target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
  target.addEventListener(event, callback, { passive: true });

  if (!isBody) {
    attachToScrollParents(
      getScrollParent(target.parentNode),
      event,
      callback,
      scrollParents
    );
  }
  scrollParents.push(target);
}

/**
 * Setup needed event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @argument {Element} reference
 * @argument {Object} options
 * @argument {ListenersStateObject} state
 * @argument {EventListenerOrEventListenerObject} updateBound
 * @returns {ListenersStateObject}
 * @private
 */
export default function setupEventListeners(
  reference,
  options,
  state,
  updateBound
) {
  // Resize event listener on window
  state.updateBound = updateBound;
  getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });

  // Scroll event listener on scroll parents
  const scrollElement = getScrollParent(reference);
  attachToScrollParents(
    scrollElement,
    'scroll',
    state.updateBound,
    state.scrollParents
  );
  state.scrollElement = scrollElement;
  state.eventsEnabled = true;

  return state;
}

/**
 * @typedef {Object} ListenersStateObject
 *
 * @property {EventListenerOrEventListenerObject} updateBound
 * @property {Element[]} scrollParents
 * @property {Element} scrollElement
 * @property {Boolean} eventsEnabled
 */
