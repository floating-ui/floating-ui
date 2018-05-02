// @flow
import format from './format';
import { read, main, write } from '../enums';

const ERROR_MESSAGE =
  'PopperJS: modifier "%s" provided an invalid %s property, expected %s but got %s';
const VALID_PROPERTIES = [
  'name',
  'enabled',
  'phase',
  'fn',
  'onLoad',
  'requires',
  'options',
];

export default (modifiers: Array<any>): void => {
  modifiers.forEach(modifier => {
    Object.keys(modifier).forEach(key => {
      switch (key) {
        case 'name':
          if (typeof modifier.name !== 'string') {
            console.error(
              format(
                ERROR_MESSAGE,
                String(modifier.name),
                '"name"',
                '"string"',
                `"${String(modifier.name)}"`
              )
            );
          }
          break;
        case 'enabled':
          if (typeof modifier.enabled !== 'boolean') {
            console.error(
              format(
                ERROR_MESSAGE,
                modifier.name,
                '"enabled"',
                '"boolean"',
                `"${String(modifier.enabled)}"`
              )
            );
          }
        case 'phase':
          if (![read, main, write].includes(modifier.phase)) {
            console.error(
              format(
                ERROR_MESSAGE,
                modifier.name,
                '"phase"',
                'either "read", "main" or "write"',
                `"${String(modifier.phase)}"`
              )
            );
          }
          break;
        case 'fn':
          if (typeof modifier.fn !== 'function') {
            console.error(
              format(
                ERROR_MESSAGE,
                modifier.name,
                '"fn"',
                '"function"',
                `"${String(modifier.fn)}"`
              )
            );
          }
          break;
        case 'onLoad':
          if (typeof modifier.onLoad !== 'function') {
            console.error(
              format(
                ERROR_MESSAGE,
                modifier.name,
                '"onLoad"',
                '"function"',
                `"${String(modifier.fn)}"`
              )
            );
          }
          break;
        case 'requires':
          if (!Array.isArray(modifier.requires)) {
            console.error(
              format(
                ERROR_MESSAGE,
                modifier.name,
                '"requires"',
                '"array"',
                `"${String(modifier.requires)}"`
              )
            );
          }
          break;
        case 'object':
          break;
        default:
          console.error(
            `PopperJS: an invalid property has been provided to the "${
              modifier.name
            }" modifier, valid properties are ${VALID_PROPERTIES.map(
              s => `"${s}"`
            ).join(', ')}; but "${key}" was provided.`
          );
      }
    });
  });
};
