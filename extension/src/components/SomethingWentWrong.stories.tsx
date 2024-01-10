import type {Meta, StoryObj} from '@storybook/react';

import type * as Devtools from '../contexts/devtools';
import {SomethingWentWrong} from './SomethingWentWrong';

export default {
  title: '`Components/Something Went Wrong',
  parameters: {
    layout: 'centered',
  },
  argTypes: {resetErrorBoundary: {action: 'reload'}},
  component: SomethingWentWrong,
} satisfies Meta<typeof SomethingWentWrong>;

type Story = StoryObj<typeof SomethingWentWrong>;

export const ChromeEvaluationExceptionError: Story = {
  args: {
    error: {
      isError: true,
      description: 'Chrome evaluation error message',
    } satisfies Devtools.ChromeEvaluationError,
  },
};

export const ChromeEvaluationException: Story = {
  args: {
    error: {
      isException: true,
      value: 'Chrome evaluation exception message',
    } satisfies Devtools.ChromeEvaluationException,
  },
};

export const ErrorInstance: Story = {
  args: {
    error: new Error('Error instance message'),
  },
};

export const StringError: Story = {
  args: {
    error: 'String error message',
  },
};
export const ObjectError: Story = {
  args: {
    error: {message: 'Object as an error'},
  },
};
