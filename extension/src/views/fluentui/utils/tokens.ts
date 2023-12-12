import {tokens as fluentTokens} from '@fluentui/react-components';

export type LocalTokens = {
  stringColor: string;
  htmlElementColor: string;
  propertyColor: string;
};

export const tokens = {
  stringColor: 'var(--fuidt-stringColor)',
  htmlElementColor: 'var(--fuidt-htmlElementColor)',
  propertyColor: 'var(--fuidt-propertyColor)',
  ...fluentTokens,
} satisfies {[Key in keyof LocalTokens]: `var(--fuidt-${Key})`};
