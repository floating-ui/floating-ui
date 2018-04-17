// @flow
import type { Modifier } from "../types";
export default (modifiers: Array<Modifier>): Array<Modifier> =>
  modifiers.sort((m1, m2) => ((m2.requires || []).includes(m1.name) ? -1 : 1));
