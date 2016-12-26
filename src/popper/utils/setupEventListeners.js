import getScrollParent from './getScrollParent';

/**
 * Setup needed event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
export default function setupEventListeners(reference, options, state, updateBound) {
    // NOTE: 1 DOM access here
    state.updateBound = updateBound;
    window.addEventListener('resize', state.updateBound, { passive: true });
    let target = getScrollParent(reference);
    if (target === window.document.body) {
        target = window;
    }
    target.addEventListener('scroll', state.updateBound, { passive: true });
    state.scrollElement = target;
}
