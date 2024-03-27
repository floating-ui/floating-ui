import {
  Button,
  makeStyles,
  Popover as FluentUIPopover,
  PopoverSurface,
  PopoverTrigger,
} from '@fluentui/react-components';
import type {Meta} from '@storybook/react';
import * as React from 'react';

import {fluentDecorator} from '../../utils/decorators';

const useStyles = makeStyles({
  contentHeader: {
    marginTop: '0',
  },
});

export default {
  title: 'Examples/Fluent UI',
  parameters: {
    layout: 'centered',
  },
  decorators: [fluentDecorator()],
  component: FluentUIPopover,
} satisfies Meta;

export const Popover = () => (
  <FluentUIPopover defaultOpen>
    <PopoverTrigger disableButtonEnhancement>
      <Button>Open Popover</Button>
    </PopoverTrigger>

    <PopoverSurface tabIndex={-1}>
      <PopoverContent />
    </PopoverSurface>
  </FluentUIPopover>
);

const PopoverContent = () => {
  const styles = useStyles();
  return (
    <div>
      <h3 className={styles.contentHeader}>Popover content</h3>
      <div>This is some popover content</div>
    </div>
  );
};
