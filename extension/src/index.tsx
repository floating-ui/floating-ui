import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ErrorBoundary} from 'react-error-boundary';

import {Devtools} from './components/Devtools';
import {DevtoolsThemeProvider} from './contexts/devtools';
import SomethingWentWrong from './views/common/components/SomethingWentWrong';

ReactDOM.render(
  <React.StrictMode>
    <DevtoolsThemeProvider>
      <ErrorBoundary fallback={<SomethingWentWrong />}>
        <Devtools />
      </ErrorBoundary>
    </DevtoolsThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
