/**
 * chrome is a global variable injected by the browser
 * in extension environment https://developer.chrome.com/docs/extensions
 * it's usage should be limited to this file
 */
/* eslint no-restricted-globals: ["off", "chrome"] */

import * as React from 'react';

import type {ReferenceId, Serialized} from '../types';
import {CONTROLLER, ELEMENT_METADATA} from '../utils/constants';
import type {Data} from '../views';

export type DevtoolsContextValue<D = Data> = {
  inspect: (referenceId: ReferenceId) => Promise<void>;
  debug: () => Promise<void>;
  reload: () => void;
  theme: 'default' | 'dark';
  serializedData: Serialized<D>;
  forceUpdateSerializedData: () => void;
};

const noop = () => {};
const noopp = async () => {};

export const devtoolsDefaultContextValue: DevtoolsContextValue = {
  inspect: noopp,
  debug: noopp,
  reload: noop,
  theme: 'default',
  serializedData: {type: 'Unknown'},
  forceUpdateSerializedData: noop,
};

const DevtoolsContext = React.createContext<DevtoolsContextValue>(
  devtoolsDefaultContextValue,
);

export const {Provider: DevtoolsProvider} = DevtoolsContext;

export const useDevtools = <Type extends Data['type']>(type?: Type) => {
  const ctx = React.useContext(DevtoolsContext);
  if (type === ctx.serializedData.type || type === undefined) {
    return ctx as DevtoolsContextValue<Extract<Data, {type: Type}>>;
  }
  throw new Error(`Error: Unknown type ${type}`);
};

export const useChromeDevtoolsContextValue = (): DevtoolsContextValue => {
  const [serializedData, setSerializedData] = React.useState<Serialized<Data>>({
    type: 'Unknown',
  });

  const forceUpdateSerializedData = React.useCallback(async () => {
    setSerializedData(
      await evalInspectedWindow<Serialized<Data> | null | undefined>(
        `$0?.ownerDocument?.defaultView?.['${CONTROLLER}']?.select($0)?.['${ELEMENT_METADATA}']?.serializedData`,
      )
        .then<Serialized<Data>>((data) => data ?? {type: 'Unknown'})
        .catch<Serialized<Data>>(
          (error: chrome.devtools.inspectedWindow.EvaluationExceptionInfo) => ({
            type: 'EvaluationException',
            info: error,
          }),
        ),
    );
  }, []);

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
    debug: async () => {
      try {
        await evalInspectedWindow(`void setTimeout(() => {debugger;}, 2000);`);
      } catch (error: unknown) {
        setSerializedData({
          type: 'EvaluationException',
          info: error as chrome.devtools.inspectedWindow.EvaluationExceptionInfo,
        });
      }
    },
    inspect: async (referenceId) => {
      try {
        await evalInspectedWindow(
          `void inspect($0.ownerDocument.defaultView['${CONTROLLER}'].selectedElement['${ELEMENT_METADATA}'].references.get('${referenceId}'));`,
        );
      } catch (error: unknown) {
        setSerializedData({
          type: 'EvaluationException',
          info: error as chrome.devtools.inspectedWindow.EvaluationExceptionInfo,
        });
      }
    },
    serializedData,
    forceUpdateSerializedData,
    theme: chrome.devtools.panels.themeName,
    reload: chrome.devtools.inspectedWindow.reload,
  };
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
