import type {Preview} from '@storybook/react';
import { devtoolsDecorator } from "../src/utils/decorators";

const preview: Preview = {
  parameters: {
    backgrounds: {
      disable: true,
    },
  },
  decorators: [devtoolsDecorator()]
};

export default preview;
