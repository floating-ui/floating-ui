// @flow

export default function expandToHashMap<
  T: number | string | boolean,
  K: string
>(value: T, keys: Array<K>): { [key: string]: T } {
  return keys.reduce((hashMap, key) => {
    hashMap[key] = value;
    return hashMap;
  }, {});
}
