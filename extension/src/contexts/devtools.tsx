/**
 * chrome is a global variable injected by the browser
 * in extension environment https://developer.chrome.com/docs/extensions
 * it's usage should be limited to this file
 */

import * as React from 'react';
import {CONTROLLER, ELEMENT_METADATA} from '../utils/constants';
import {ReferenceId} from '../utils/references';
import themes from '../styles/themes.module.css';

export type DevtoolsContextValue = {
  inspectByReferenceId: (referenceId: ReferenceId) => Promise<void>;
  inspectDocument: () => Promise<void>;
  debug: () => Promise<void>;
  reloadInspectedWindow: () => void;
  dangerouslyEvalInspectedWindow: <Result>(
    expression: string,
  ) => Promise<Result | void>;
  onSelectionChanged: Pick<
    // biome-ignore lint/style/noRestrictedGlobals: @see top of file
    chrome.devtools.panels.SelectionChangedEvent,
    'addListener' | 'removeListener'
  >;
  onMessage: Pick<
    // biome-ignore lint/style/noRestrictedGlobals: @see top of file
    chrome.runtime.ExtensionMessageEvent,
    'addListener' | 'removeListener'
  >;
  // biome-ignore lint/style/noRestrictedGlobals: @see top of file
  theme: typeof chrome.devtools.panels.themeName;
  error: unknown;
};

const noop = () => {
  console.log('noop');
};
const noopp = async () => {
  console.log('noopp');
};
export const devtoolsDefaultContextValue: DevtoolsContextValue = {
  inspectByReferenceId: noopp,
  debug: noopp,
  reloadInspectedWindow: noop,
  dangerouslyEvalInspectedWindow: noopp,
  inspectDocument: noopp,
  onSelectionChanged: {
    addListener: noop,
    removeListener: noop,
  },
  onMessage: {
    addListener: noop,
    removeListener: noop,
  },
  theme: 'default',
  error: undefined,
};

const DevtoolsContext = React.createContext<DevtoolsContextValue>(
  devtoolsDefaultContextValue,
);

export const DevtoolsProvider = (
  props: React.ProviderProps<DevtoolsContextValue>,
) => (
  <div className={themes[props.value.theme]}>
    <DevtoolsContext.Provider {...props} />
  </div>
);

export const useDevtools = () => React.useContext(DevtoolsContext);

export const useChromeDevtoolsContextValue = (): DevtoolsContextValue => {
  const [error, setError] = React.useState<unknown>(undefined);
  return {
    error,
    // biome-ignore lint/style/noRestrictedGlobals: @see top of file
    onSelectionChanged: chrome.devtools.panels.elements.onSelectionChanged,
    // biome-ignore lint/style/noRestrictedGlobals: @see top of file
    onMessage: chrome.runtime.onMessage,
    // biome-ignore lint/style/noRestrictedGlobals: @see top of file
    theme: chrome.devtools.panels.themeName,
    inspectDocument: React.useCallback(async () => {
      await evalInspectedWindow<void>(`void inspect($0.ownerDocument);`).catch(
        setError,
      );
    }, []),
    dangerouslyEvalInspectedWindow: React.useCallback(
      <Result,>(expression: string) =>
        evalInspectedWindow<Result>(expression).catch(setError),
      [],
    ),
    debug: React.useCallback(async () => {
      evalInspectedWindow<void>(
        `void setTimeout(() => {debugger;}, 2000);`,
      ).catch(setError);
    }, []),
    inspectByReferenceId: React.useCallback(async (referenceId) => {
      evalInspectedWindow<void>(
        `void inspect($0.ownerDocument.defaultView['${CONTROLLER}'].selectedElement['${ELEMENT_METADATA}'].references.get('${referenceId}'));`,
      ).catch(setError);
    }, []),
    // biome-ignore lint/style/noRestrictedGlobals: @see top of file
    reloadInspectedWindow: chrome.devtools.inspectedWindow.reload,
  };
};

/**
 * Evaluates an expression in the context of the inspected page
 */
const evalInspectedWindow = <Result,>(expression: string): Promise<Result> =>
  new Promise((resolve, reject) =>
    // biome-ignore lint/style/noRestrictedGlobals: @see top of file
    chrome.devtools.inspectedWindow.eval<Result>(
      expression,
      {},
      (result, error) => (error ? reject(error) : resolve(result)),
    ),
  );

export type ChromeEvaluationException = Pick<
  // biome-ignore lint/style/noRestrictedGlobals: @see top of file
  chrome.devtools.inspectedWindow.EvaluationExceptionInfo,
  'value' | 'isException'
>;

export type ChromeEvaluationError = Pick<
  // biome-ignore lint/style/noRestrictedGlobals: @see top of file
  chrome.devtools.inspectedWindow.EvaluationExceptionInfo,
  'description' | 'isError'
>;

export const isChromeEvaluationException = (
  error: unknown,
): error is ChromeEvaluationException =>
  typeof error === 'object' &&
  error !== null &&
  'isException' in error &&
  error.isException === true;

export const isChromeEvaluationError = (
  error: unknown,
): error is ChromeEvaluationError =>
  typeof error === 'object' &&
  error !== null &&
  'isError' in error &&
  error.isError === true;
