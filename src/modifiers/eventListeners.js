// @flow
import type { ModifierArguments, Modifier } from '../types';
import getWindow from '../dom-utils/getWindow';
type Options = { scroll: boolean, resize: boolean };

export function onLoad({
  state,
  options = {},
  instance,
}: ModifierArguments<Options>) {
  const { scroll = true, resize = true } = options;

  if (scroll) {
    const scrollParents = [
      ...state.scrollParents.reference,
      ...state.scrollParents.popper,
    ];

    scrollParents.forEach(scrollParent =>
      scrollParent.addEventListener('scroll', instance.update, {
        passive: true,
      })
    );
  }

  if (resize) {
    const window = getWindow(state.elements.popper);
    window.addEventListener('resize', instance.update, {
      passive: true,
    });
  }
}

export function onDestroy({
  state,
  options = {},
  instance,
}: ModifierArguments<Options>) {
  const { scroll = true, resize = true } = options;

  if (scroll) {
    // Remove scroll event listeners
    const scrollParents = [
      ...state.scrollParents.reference,
      ...state.scrollParents.popper,
    ];

    scrollParents.forEach(scrollParent =>
      scrollParent.removeEventListener('scroll', instance.update)
    );
  }

  if (resize) {
    // Remove resize event listeners
    const window = getWindow(state.elements.popper);
    window.removeEventListener('resize', instance.update);
  }
}

export default ({
  name: 'offset',
  enabled: true,
  phase: 'write',
  fn: ({ state }) => state,
  onLoad,
  onDestroy,
}: Modifier<Options>);
