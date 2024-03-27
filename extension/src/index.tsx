import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Devtools} from './components/Devtools';

// eslint-disable-next-line react/no-deprecated
ReactDOM.render(
  <React.StrictMode>
    <Devtools />
  </React.StrictMode>,
  document.getElementById('root'),
);
