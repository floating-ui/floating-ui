import * as common from './common';
import * as floatingUI from './floating-ui';
import * as fluentUI from './fluentui';

export type Datatype =
  | common.Datatype
  | floatingUI.Datatype
  | fluentUI.Datatype;

export const views = {
  ...common.views,
  ...floatingUI.views,
  ...fluentUI.views,
};
