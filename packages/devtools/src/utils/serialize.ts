import type {Serialized} from '../extension/types';
import {isHTMLElement} from './isHTMLElement';
import {type References, createReferences} from './references';

export const serialize = <Data extends object>(
  data: Data,
): [serializedData: Serialized<Data>, references: References] => {
  const references = createReferences();
  const serializedData: Serialized<Data> = JSON.parse(
    JSON.stringify(data, (_, value) => {
      if (isHTMLElement(value)) {
        return references.add(value);
      }
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
  return [serializedData, references];
};
