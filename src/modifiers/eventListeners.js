// @flow
import type { ModifierArguments, Modifier } from '../types';
import getWindow from '../dom-utils/getWindow';

type Options = {
  scroll: boolean,
  resize: boolean,
};

const passive = { passive: true };

function toggleEventListeners({ state, instance, scroll, resize }) {
  if (scroll != null) {
    const scrollParents = [
      ...state.scrollParents.reference,
      ...state.scrollParents.popper,
    ];

    scrollParents.forEach(scrollParent => {
      if (scroll) {
        scrollParent.addEventListener('scroll', instance.update, passive);
      } else {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      }
    });
  }

  if (resize != null) {
    const window = getWindow(state.elements.popper);

    if (resize) {
      window.addEventListener('resize', instance.update, passive);
    } else {
      window.removeEventListener('resize', instance.update, passive);
    }
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

  // Set options to `null` if they didn't change, so we know not to run any
  // logic
  if (data.scroll === scroll) {
    scroll = null;
  }
  if (data.resize === resize) {
    resize = null;
  }

  // Update cache
  state.modifiersData[`${name}#persistent`] = { scroll, resize };

  toggleEventListeners({ state, instance, scroll, resize });
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
