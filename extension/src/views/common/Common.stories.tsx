import type {Meta} from '@storybook/react';

import {
  devtoolsDefaultContextValue,
  DevtoolsProvider,
} from '../../contexts/devtools';
import EvalErrorPanel from './components/EvalError';
import UnknownPanel from './components/Unknown';

export default {
  title: 'Panels',
  parameters: {
    layout: 'centered',
  },
  decorators: [],
} satisfies Meta;

export const Unknown = () => <UnknownPanel />;
export const EvalError = () => <EvalErrorPanel />;
EvalError.decorators = [
  (Story: React.ElementType) => (
    <DevtoolsProvider
      value={{
        ...devtoolsDefaultContextValue,
        serializedData: {
          type: 'EvaluationException',
          info: {
            code: '',
            description: 'This is a test',
            details: [],
            isError: true,
            isException: true,
            value: '',
          },
        },
      }}
    >
      <Story />
    </DevtoolsProvider>
  ),
];
