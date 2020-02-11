// @flow
import type { Modifier } from '../types';

export default function mergeByName(
  modifiers: Array<$Shape<Modifier<any>>>
): Array<$Shape<Modifier<any>>> {
  const merged = modifiers.reduce((merged, current) => {
    const existing = merged[current.name];
    merged[current.name] = existing
      ? {
          ...existing,
          ...current,
          options: { ...existing.options, ...current.options },
          data: { ...existing.data, ...current.data },
        }
      : current;
    return merged;
  }, {});

  // IE11 does not support Object.values
  return Object.keys(merged).map(key => merged[key]);
}
