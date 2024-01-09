/**
 * chrome is a global variable injected by the browser
 * in extension environment https://developer.chrome.com/docs/extensions
 * it's usage should be limited to this file
 */
/* eslint no-restricted-globals: ["off", "chrome"] */

import * as React from 'react';
import {useErrorBoundary} from 'react-error-boundary';

import type {ReferenceId, Serialized} from '../types';
import {CONTROLLER, ELEMENT_METADATA} from '../utils/constants';
import type {Data} from '../views';

export type DevtoolsContextValue<D = Data> = {
  inspect: (referenceId: ReferenceId) => Promise<void>;
  debug: () => Promise<void>;
  reload: () => Promise<void>;
  serializedData: Serialized<D>;
  forceUpdateSerializedData: () => void;
};

export type DevtoolsThemeContextValue = typeof chrome.devtools.panels.themeName;

const noop = () => {};
const noopp = async () => {};

export const devtoolsDefaultContextValue: DevtoolsContextValue = {
  inspect: noopp,
  debug: noopp,
  reload: noopp,
  serializedData: {type: 'Unknown'},
  forceUpdateSerializedData: noop,
};

export const devtoolsThemeDefaultContextValue: DevtoolsThemeContextValue =
  chrome.devtools?.panels.themeName ?? 'default';

const DevtoolsContext = React.createContext<DevtoolsContextValue>(
  devtoolsDefaultContextValue,
);

const DevtoolsThemeContext = React.createContext<DevtoolsThemeContextValue>(
  devtoolsThemeDefaultContextValue,
);

export const {Provider: DevtoolsProvider} = DevtoolsContext;

export const DevtoolsThemeProvider = React.memo(
  (props: {value?: DevtoolsThemeContextValue; children?: React.ReactNode}) => (
    <DevtoolsThemeContext.Provider
      value={devtoolsThemeDefaultContextValue}
      {...props}
    />
  ),
);

export const useDevtools = <Type extends Data['type']>(type?: Type) => {
  const devtoolsContext = React.useContext(DevtoolsContext);
  const devtoolsThemeContext = React.useContext(DevtoolsThemeContext);
  if (type === devtoolsContext.serializedData.type || type === undefined) {
    return {
      ...devtoolsContext,
      theme: devtoolsThemeContext,
    } as DevtoolsContextValue<Extract<Data, {type: Type}>> & {
      theme: DevtoolsThemeContextValue;
    };
  }
  throw new Error(`Error: Unknown type ${type}`);
};

export const useChromeDevtoolsContextValue = (): DevtoolsContextValue => {
  const {showBoundary} = useErrorBoundary();
  const [serializedData, setSerializedData] = React.useState<Serialized<Data>>({
    type: 'Unknown',
  });

  const forceUpdateSerializedData = React.useCallback(async () => {
    try {
      setSerializedData(await getLatestSerializedData());
    } catch (error) {
      showBoundary(error);
    }
  }, [showBoundary]);

  React.useEffect(() => {
    forceUpdateSerializedData();
    chrome.devtools.panels.elements.onSelectionChanged.addListener(
      forceUpdateSerializedData,
    );
    return () => {
      chrome.devtools.panels.elements.onSelectionChanged.removeListener(
        forceUpdateSerializedData,
      );
    };
  }, [forceUpdateSerializedData]);
  return {
    debug: () =>
      evalInspectedWindow<void>(
        `void setTimeout(() => {debugger;}, 2000);`,
      ).catch(showBoundary),
    inspect: (referenceId) =>
      evalInspectedWindow<void>(
        `void inspect($0.ownerDocument.defaultView['${CONTROLLER}'].selectedElement['${ELEMENT_METADATA}'].references.get('${referenceId}'));`,
      ).catch(showBoundary),
    serializedData,
    forceUpdateSerializedData,
    reload: reloadInspectedWindow,
  };
};

/**
 * reloads window and inspects the document to reset selection
 */
const reloadInspectedWindow = async () => {
  chrome.devtools.inspectedWindow.reload();
};

/**
 * Evaluates an expression in the context of the inspected page
 */
const evalInspectedWindow = <Result,>(expression: string): Promise<Result> =>
  new Promise((resolve, reject) =>
    chrome.devtools.inspectedWindow.eval<Result>(
      expression,
      {},
      (result, error) => (error ? reject(error) : resolve(result)),
    ),
  );

const getLatestSerializedData = async (): Promise<Serialized<Data>> =>
  (await evalInspectedWindow<Serialized<Data> | null | undefined>(
    `
    $0?.ownerDocument?.defaultView?.['${CONTROLLER}']?.select($0)?.['${ELEMENT_METADATA}']?.serializedData;
    `,
  )) ?? {type: 'Unknown'};

export const isEvaluationException = (
  error: unknown,
): error is Pick<
  chrome.devtools.inspectedWindow.EvaluationExceptionInfo,
  'isException' | 'value'
> =>
  typeof error === 'object' &&
  error !== null &&
  'isException' in error &&
  error.isException === true;

export const isEvaluationError = (
  error: unknown,
): error is Omit<
  chrome.devtools.inspectedWindow.EvaluationExceptionInfo,
  'isException' | 'value'
> =>
  typeof error === 'object' &&
  error !== null &&
  'isError' in error &&
  error.isError === true;
