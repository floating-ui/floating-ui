import type React from 'react';

import * as common from './common';
import * as floatingUI from './floating-ui';
import * as fluentUI from './fluentui';

export type Data = common.Datatype | floatingUI.Datatype | fluentUI.Datatype;

export const views: Record<Data['type'], React.FC> = {
  ...common.views,
  ...floatingUI.views,
  ...fluentUI.views,
};
