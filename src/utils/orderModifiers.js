// @flow
import type { Modifier } from '../types';
import { modifierPhases } from '../enums';

// source: https://stackoverflow.com/questions/49875255
const order = modifiers => {
  const map = modifiers.reduce((acc, modifier) => {
    acc[modifier.name] = modifier;
    return acc;
  }, {});
  const visited = {};
  const result = [];

  // On visiting object, check for its dependencies and visit them recursively
  function sort(modifier) {
    visited[modifier.name] = true;

    const requires = [
      ...(modifier.requires || []),
      ...(modifier.optionallyRequires || []),
    ];

    requires.forEach(dep => {
      if (!visited[dep]) {
        sort(map[dep]);
      }
    });

    result.push(modifier);
  }

  modifiers.forEach(modifier => {
    if (!visited[modifier.name]) {
      // check for visited object
      sort(modifier);
    }
  });

  return result;
};

export default (modifiers: Array<Modifier<any>>): Array<Modifier<any>> => {
  // order based on dependencies
  const orderedModifiers = order(modifiers);

  // order based on phase
  return modifierPhases.reduce((acc, phase) => {
    return acc.concat(
      orderedModifiers.filter(modifier => modifier.phase === phase)
    );
  }, []);
};
