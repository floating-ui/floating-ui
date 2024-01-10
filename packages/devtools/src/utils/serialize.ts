import type {Serialized} from 'extension/types';

import {isHTMLElement} from './isHTMLElement';
import {References} from 'extension/utils/references';

export const serialize = <Data extends object>(
  data: Data,
  references: References,
): Serialized<Data> => {
  const serializedData: Serialized<Data> = JSON.parse(
    JSON.stringify(data, (_, value) => {
      if (isHTMLElement(value)) return references.add(value);
      if (
        typeof value === 'object' &&
        value &&
        Object.getPrototypeOf(value) !== Object.prototype &&
        Object.getPrototypeOf(value) !== Array.prototype
      ) {
        if ('toString' in value) {
          return value.toString();
        }
        return undefined;
      }
      return value;
    }),
  );
  return serializedData;
};
