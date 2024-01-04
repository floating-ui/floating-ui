import type {Meta} from '@storybook/react';
import {ErrorBoundaryContext} from 'react-error-boundary';

import {
  devtoolsDefaultContextValue,
  DevtoolsProvider,
} from '../../contexts/devtools';
import {HTML_ELEMENT_REFERENCE} from '../../utils/constants';
import SomethingWentWrongPanel from './components/SomethingWentWrong';
import UnknownPanel from './components/Unknown';

export default {
  title: 'Panels',
  parameters: {
    layout: 'centered',
  },
  decorators: [],
} satisfies Meta;

export const Unknown = () => <UnknownPanel />;
export const EvaluationException = () => <SomethingWentWrongPanel />;
EvaluationException.decorators = [
  (Story: React.ElementType) => (
    <ErrorBoundaryContext.Provider
      value={{
        didCatch: true,
        error: {
          code: '',
          description: 'This is an error description',
          details: [],
          isError: true,
          isException: false,
          value: '',
        },
        resetErrorBoundary: () => {},
      }}
    >
      <Story />
    </ErrorBoundaryContext.Provider>
  ),
];

export const SomethingWentWrong = () => <SomethingWentWrongPanel />;
SomethingWentWrong.decorators = [
  (Story: React.ElementType) => (
    <ErrorBoundaryContext.Provider
      value={{
        didCatch: true,
        error: new Error('This is an error message'),
        resetErrorBoundary: () => {},
      }}
    >
      <DevtoolsProvider
        value={{
          ...devtoolsDefaultContextValue,
          serializedData: {
            elements: {
              floating: dummyReferenceId,
              reference: dummyReferenceId,
            },
            x: 0,
            y: 0,
            type: 'FloatingUIMiddleware',
            strategy: 'absolute',
            rects: {
              floating: {x: 0, y: 0, width: 0, height: 0},
              reference: {x: 0, y: 0, width: 0, height: 0},
            },
            placement: 'bottom',
            initialPlacement: 'bottom-end',
            middlewareData: {},
          },
        }}
      >
        <Story />
      </DevtoolsProvider>
    </ErrorBoundaryContext.Provider>
  ),
];

const dummyReferenceId = `${HTML_ELEMENT_REFERENCE}:1` as const;
