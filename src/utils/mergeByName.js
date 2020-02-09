// @flow
import type { Modifier } from '../types';

export default function mergeByName(
  modifiers: Array<$Shape<Modifier<any>>>
): Array<$Shape<Modifier<any>>> {
  const modifiersMap = new Map();

  modifiers.forEach(modifier => {
    const currentModifier = modifiersMap.get(modifier.name);

    modifiersMap.set(
      modifier.name,
      currentModifier
        ? {
            ...currentModifier,
            ...modifier,
            // $FlowFixMe
            options: { ...currentModifier.options, ...modifier.options },
            // $FlowFixMe
            data: { ...currentModifier.data, ...modifier.data },
          }
        : modifier
    );
  });

  const result = [];

  // IE11 doesn't support map.values() 😞
  modifiersMap.forEach(modifier => {
    result.push(modifier);
  });

  return result;
}
