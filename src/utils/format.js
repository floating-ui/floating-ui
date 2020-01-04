// @flow

export default function format(str: string, ...args: Array<string>) {
  return [...args].reduce((p, c) => p.replace(/%s/, c), str);
}
