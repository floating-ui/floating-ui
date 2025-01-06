import type {Meta, StoryObj} from '@storybook/react';

import {SidePanel as SidePanelComponent} from './SidePanel';

export default {
  title: 'Components/SidePanel',
  component: SidePanelComponent,
} satisfies Meta<typeof SidePanelComponent>;

type Story = StoryObj<typeof SidePanelComponent>;

export const SidePanel: Story = {};
