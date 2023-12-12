import React from 'react';

import {useDevtools} from '../../../contexts/devtools';

export const EvaluationException = React.memo(() => {
  // TODO: Implement this component
  // This component should be rendered when an error occurs while evaluating the selected serialized data
  const devtools = useDevtools('EvaluationException');
  console.log(devtools.serializedData.info);
  return <div>{devtools.serializedData.info.description}</div>;
});

export default EvaluationException;
