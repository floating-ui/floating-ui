/**
 * Remove event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
export default function removeEventListeners(reference, state) {
  const ownerDocument = reference.ownerDocument
  const view = ownerDocument ? ownerDocument.defaultView : window;

  // Remove resize event listener on window
  view.removeEventListener('resize', state.updateBound);

  // Remove scroll event listener on scroll parents
  state.scrollParents.forEach(target => {
    target.removeEventListener('scroll', state.updateBound);
  });

  // Reset state
  state.updateBound = null;
  state.scrollParents = [];
  state.scrollElement = null;
  state.eventsEnabled = false;
  return state;
}
