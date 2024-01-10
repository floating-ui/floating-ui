import type {Meta, StoryObj} from '@storybook/react';

import UnknownPanel from './Unknown';

export default {
  title: 'Views/Unknown',
  parameters: {
    layout: 'centered',
  },
  decorators: [],
  component: UnknownPanel,
} satisfies Meta<typeof UnknownPanel>;

export const Unknown: StoryObj<typeof UnknownPanel> = {
  args: {
    serializedData: [{type: 'Unknown'}],
  },
};
