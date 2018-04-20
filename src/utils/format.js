// @flow
export default (str: string, ...args: Array<string>) =>
  [...args].reduce((p, c) => p.replace(/%s/, c), str);
