// @flow

// eslint-disable-next-line import/no-unused-modules
export default function format(str: string, ...args: Array<string>) {
  return [...args].reduce((p, c) => p.replace(/%s/, c), str);
}
