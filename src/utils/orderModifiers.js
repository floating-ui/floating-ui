// @flow
import type { Modifier } from '../types';

// source: https://stackoverflow.com/questions/49875255
const order = modifiers => {
  // indexed by name
  const mapped = modifiers.reduce((mem, i) => {
    mem[i.name] = i;
    return mem;
  }, {});

  // inherit all dependencies for a given name
  const inherited = i => {
    return mapped[i].requires.reduce((mem, i) => {
      return [...mem, i, ...inherited(i)];
    }, []);
  };

  // order ...
  const ordered = modifiers.sort((a, b) => {
    return !!~inherited(b.name).indexOf(a.name) ? -1 : 1;
  });
  return ordered;
};

export default (modifiers: Array<Modifier>): Array<Modifier> => [
  ...order(modifiers.filter(({ phase }) => phase === 'read')),
  ...order(modifiers.filter(({ phase }) => phase === 'main')),
  ...order(modifiers.filter(({ phase }) => phase === 'write')),
];
