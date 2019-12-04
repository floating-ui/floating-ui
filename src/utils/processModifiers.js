// @flow
import type { Modifier } from '../types';
import orderModifiers from './orderModifiers';

const namespaceModifiers = modifiers => {
  return modifiers.map(modifier => {
    if (modifier.namespace != null) {
      return {
        ...modifiers.find(current => current.name === modifier.name),
        ...modifier,
      };
    } else {
      return { namespace: 'default', ...modifier };
    }
  });
};

export default (modifiers: Array<Modifier<any>>): Array<Modifier<any>> => {
  const namespaced = namespaceModifiers(modifiers);
  const ordered = orderModifiers(namespaced);

  return ordered;
};
