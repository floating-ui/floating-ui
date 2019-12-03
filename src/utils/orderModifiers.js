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
    return mapped[i] && mapped[i].requires
      ? mapped[i].requires.reduce((mem, i) => {
          return [...mem, i, ...inherited(i)];
        }, [])
      : [];
  };

  // order ...
  const ordered = modifiers.sort((a, b) => {
    return !!~inherited(b.name).indexOf(a.name) ? -1 : 1;
  });
  return ordered;
};

export default (modifiers: Array<Modifier<any>>): Array<Modifier<any>> =>
  ['read', 'main', 'afterMain', 'write'].reduce(
    (acc, currentPhase) =>
      acc.concat(
        order(modifiers.filter(modifier => modifier.phase === currentPhase))
      ),
    []
  );
