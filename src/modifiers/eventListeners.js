// @flow
import type { ModifierArguments, Modifier } from '../types';
import getWindow from '../dom-utils/getWindow';
type Options = { scroll: boolean, resize: boolean };

const passive = { passive: true };

function toggleEventListeners({ state, instance, scroll, resize }) {
  if (scroll != null) {
    const scrollParents = [
      ...state.scrollParents.reference,
      ...state.scrollParents.popper,
    ];

    scrollParents.forEach(scrollParent =>
      scroll
        ? scrollParent.addEventListener('scroll', instance.update, passive)
        : scrollParent.removeEventListener('scroll', instance.update)
    );
  }

  if (resize != null) {
    const window = getWindow(state.elements.popper);
    resize
      ? window.addEventListener('resize', instance.update, passive)
      : window.removeEventListener('resize', instance.update);
  }
}

function onLoad({
  state,
  instance,
  name,
  options,
}: ModifierArguments<Options>) {
  const { scroll = true, resize = true } = options;

  // cache initial options so we can compare them later
  state.modifiersData[`${name}#persistent`] = { scroll, resize };

  toggleEventListeners({ state, instance, scroll, resize });

  return state;
}

function onDestroy({ state, instance }: ModifierArguments<Options>) {
  toggleEventListeners({ state, instance, scroll: false, resize: false });
}

function update({
  state,
  options,
  instance,
  name,
}: ModifierArguments<Options>) {
  const data = state.modifiersData[`${name}#persistent`];
  let { scroll = true, resize = true } = options;

  // set options to `null` if they didn't change, so we know not to run any logic
  if (data.scroll === scroll) {
    scroll = null;
  }
  if (data.resize === resize) {
    resize = null;
  }

  // Update cache
  state.modifiersData[`${name}#persistent`] = { scroll, resize };

  toggleEventListeners({ state, instance, scroll, resize });

  return state;
}

export default ({
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: update,
  onLoad,
  onDestroy,
  data: {},
}: Modifier<Options>);
