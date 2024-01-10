import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Devtools} from './components/Devtools';

ReactDOM.render(
  <React.StrictMode>
    <Devtools />
  </React.StrictMode>,
  document.getElementById('root'),
);
