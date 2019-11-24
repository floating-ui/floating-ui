// @flow
export default function expandToHashMap<T: number | string>(
  value: T,
  keys: Array<string>
): { [key: string]: T } {
  return keys.reduce((hashMap, key) => {
    hashMap[key] = value;
    return hashMap;
  }, {});
}
