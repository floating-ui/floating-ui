/**
 * chrome is a global variable injected by the browser
 * in extension environment https://developer.chrome.com/docs/extensions
 * it's usage should be limited to this file
 */

import * as React from 'react';
import {
  CONTROLLER,
  ELEMENT_METADATA,
  type SERIALIZED_DATA_CHANGE,
} from '../utils/constants';
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
  React.useEffect(() => {
    // biome-ignore lint/style/noRestrictedGlobals:
    chrome.scripting.executeScript({
      // biome-ignore lint/style/noRestrictedGlobals:
      target: {tabId: chrome.devtools.inspectedWindow.tabId, allFrames: true},
      /**
       * Everything in this function should be local to the inspected page
       * nothing should be injected from the extension
       */
      func: () => {
        // FIXME: devtools should be agnostic of serialization
        // there should be a middle layer to abstract messaging and serialization
        const LOCAL_SERIALIZED_DATA_CHANGE: typeof SERIALIZED_DATA_CHANGE =
          '__FUIDT_SERIALIZED_DATA_CHANGE__';
        window.addEventListener(
          'message',
          (event) => {
            if (event.data === LOCAL_SERIALIZED_DATA_CHANGE) {
              // biome-ignore lint/style/noRestrictedGlobals:
              chrome.runtime.sendMessage(event.data);
            }
          },
          false,
        );
      },
    });
  }, []);
  return {
    error,
    // biome-ignore lint/style/noRestrictedGlobals: @see top of file
    onSelectionChanged: chrome.devtools.panels.elements.onSelectionChanged,
    // biome-ignore lint/style/noRestrictedGlobals: @see top of file
    onMessage: chrome.runtime.onMessage,
    // biome-ignore lint/style/noRestrictedGlobals: @see top of file
    theme: chrome.devtools.panels.themeName,
    inspectDocument: React.useCallback(async () => {
      // inspect of ownerDocument works as a "reset" mechanism, it should be used to remove errors and to set the inspected window to the current document
      await evalInspectedWindow<void>(
        `void inspect($0.ownerDocument);`,
      ).finally(() => setError(undefined));
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
        `{
          const selectedElement = $0.ownerDocument?.defaultView?.['${CONTROLLER}'].selectedElement;
          if (selectedElement) {
            void inspect(selectedElement['${ELEMENT_METADATA}'].references.get('${referenceId}'));
          }
        }`,
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
