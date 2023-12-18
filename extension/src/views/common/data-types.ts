export type UnknownData = {type: 'Unknown'};

export type EvalErrorData = {
  type: 'EvaluationException';
  // eslint-disable-next-line no-restricted-globals
  info: chrome.devtools.inspectedWindow.EvaluationExceptionInfo;
};

export type Datatype = UnknownData | EvalErrorData;
