import React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';

export default ({ code }) => (
  <Highlight {...defaultProps} code={code} language="js">
    {({ className, tokens, getLineProps, getTokenProps }) => (
      <pre className={className}>
        {tokens.map((line, i) => (
          <div {...getLineProps({ line, key: i })}>
            {line.map((token, key) => (
              <span {...getTokenProps({ token, key })} />
            ))}
          </div>
        ))}
      </pre>
    )}
  </Highlight>
);
