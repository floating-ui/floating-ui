// @flow
import type { State, Modifier } from '../types';
import getDocumentRect from '../dom-utils/getDocumentRect';

type Options = {
  boundaryElement: HTMLElement,
};

type ModifierData = {
  top: boolean,
  bottom: boolean,
  right: boolean,
  left: boolean,
};

export function detectOverflow(
  state: State,
  options: Options = {
    boundaryElement: state.elements.popper.ownerDocument.documentElement,
  }
) {
  const popperElement = state.elements.popper;
  const popperRect = state.measures.popper;
  const popperOffsets = state.offsets.popper;
  if (!options.boundaryElement.contains(popperElement)) {
    console.error(
      'PopperJS: "detectOverflow" can accept as `boundaryElement` only a parent node of the provided popper.'
    );
    return state;
  }

  const documentRect = getDocumentRect(popperElement);

  state.modifiersData.detectOverflow = {
    top: popperOffsets.y < 0,
    bottom:
      documentRect.height - state.measures.popper.height < popperOffsets.y,
    left: popperOffsets.x < 0,
    right: documentRect.width - state.measures.popper.width < popperOffsets.x,
  };

  return state;
}

export default ({
  name: 'detectOverflow',
  enabled: true,
  phase: 'read',
  fn: detectOverflow,
  data: {},
}: Modifier);
