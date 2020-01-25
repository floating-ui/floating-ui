// @flow
import { modifierPhases } from '../enums';

// source: https://stackoverflow.com/questions/49875255
function order(modifiers) {
  const map = new Map();
  const visited = new Set();
  const result = [];

  modifiers.forEach(modifier => {
    map.set(modifier.name, modifier);
  });

  // On visiting object, check for its dependencies and visit them recursively
  function sort(modifier) {
    visited.add(modifier.name);

    const requires = [
      ...(modifier.requires || []),
      ...(modifier.requiresIfExists || []),
    ];

    requires.forEach(dep => {
      if (!visited.has(dep)) {
        const depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });

    result.push(modifier);
  }

  modifiers.forEach(modifier => {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });

  return result;
}

export default function orderModifiers<M: any>(
  modifiers: Array<M>
): Array<M> {
  // order based on dependencies
  const orderedModifiers = order(modifiers);

  // order based on phase
  return modifierPhases.reduce((acc, phase) => {
    return acc.concat(
      orderedModifiers.filter(modifier => modifier.phase === phase)
    );
  }, []);
}
