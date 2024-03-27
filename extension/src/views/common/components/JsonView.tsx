import * as React from 'react';
import type {ReactJsonViewProps, ThemeKeys} from 'react-json-view';
import ReactJSONView from 'react-json-view';

import {useDevtools} from '../../../contexts/devtools';

export type JsonViewProps = ReactJsonViewProps;

export const JsonView = React.memo(function JsonView(props: JsonViewProps) {
  const devtools = useDevtools();
  const theme: ThemeKeys =
    devtools.theme === 'dark' ? 'monokai' : 'rjv-default';
  return (
    <ReactJSONView
      enableClipboard={false}
      displayObjectSize={false}
      displayDataTypes={false}
      quotesOnKeys={false}
      style={{backgroundColor: 'unset'}}
      theme={theme}
      {...props}
    />
  );
});

export default JsonView;
