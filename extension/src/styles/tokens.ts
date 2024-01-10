export type Tokens = {
  stringColor: string;
  htmlElementColor: string;
  propertyColor: string;
};

export const tokens = {
  stringColor: 'var(--fuidt-stringColor)',
  htmlElementColor: 'var(--fuidt-htmlElementColor)',
  propertyColor: 'var(--fuidt-propertyColor)',
} satisfies {[Key in keyof Tokens]: `var(--fuidt-${Key})`};
