// @flow
import type { Modifier } from '../types';

const order = modifiers => {
  let sortedModifiers = [...modifiers];
  let i = 0,
    j,
    temp;

  while (i < sortedModifiers.length) {
    temp = sortedModifiers.slice(0, i);
    for (j = i; j < sortedModifiers.length; j++) {
      if (
        (sortedModifiers[j].requires || []).every(n =>
          temp.some(({ name }) => n === name)
        )
      ) {
        sortedModifiers.splice(i++, 0, sortedModifiers.splice(j, 1)[0]);
        break;
      }
    }
  }
  return sortedModifiers;
};

export default (modifiers: Array<Modifier>): Array<Modifier> => [
  ...order(modifiers.filter(({ phase }) => phase === 'read')),
  ...order(modifiers.filter(({ phase }) => phase === 'main')),
  ...order(modifiers.filter(({ phase }) => phase === 'write')),
];
