import React from 'react';

import type {Serialized, SerializedDataChangeMessage} from '../types';
import type {Datatype} from '../views';
import type {DevtoolsContextValue} from './devtools';
import {
  CONTROLLER,
  ELEMENT_METADATA,
  SERIALIZED_DATA_CHANGE,
} from '../utils/constants';

export type SerializedDataAPI = {
  forceUpdateSerializedData: () => void;
};

export type SerializedDataContextValue = {
  serializedData: readonly Serialized<Datatype>[];
  api: SerializedDataAPI;
};

export const defaultSerializedDataContextValue: SerializedDataContextValue = {
  serializedData: [{type: 'Unknown'}],
  api: {
    forceUpdateSerializedData: () => {},
  },
};

const SerializedDataContext = React.createContext<SerializedDataContextValue>(
  defaultSerializedDataContextValue,
);

export const {Provider: SerializedDataProvider} = SerializedDataContext;

export const useSerializedDataContextValue = ({
  onSelectionChanged,
  onMessage,
  dangerouslyEvalInspectedWindow,
}: DevtoolsContextValue): SerializedDataContextValue => {
  const [serializedData, setSerializedData] = React.useState<
    readonly Serialized<Datatype>[]
  >(defaultSerializedDataContextValue.serializedData);

  const getSerializedData = React.useCallback(
    async (): Promise<readonly Serialized<Datatype>[]> =>
      (await dangerouslyEvalInspectedWindow<
        readonly Serialized<Datatype>[] | null | undefined
      >(
        `{
      const selectedElement = $0?.ownerDocument?.defaultView?.['${CONTROLLER}']?.select($0)
      if (selectedElement) {
        const metadata = selectedElement['${ELEMENT_METADATA}']
        Array.isArray(metadata.serializedData) ? metadata.serializedData : [metadata.serializedData]
      }
    }`,
      )) ?? defaultSerializedDataContextValue.serializedData,
    [dangerouslyEvalInspectedWindow],
  );

  const forceUpdateSerializedData = React.useCallback(async () => {
    setSerializedData(await getSerializedData());
  }, [getSerializedData]);

  React.useEffect(() => {
    forceUpdateSerializedData();
    const handleMessage = (message: unknown) => {
      if (isSerializedDataChangeMessage(message)) {
        forceUpdateSerializedData();
      }
    };
    onSelectionChanged.addListener(forceUpdateSerializedData);
    onMessage.addListener(handleMessage);
    return () => {
      onSelectionChanged.removeListener(forceUpdateSerializedData);
      onMessage.removeListener(handleMessage);
    };
  }, [forceUpdateSerializedData, onSelectionChanged, onMessage]);

  return {
    serializedData,
    api: {forceUpdateSerializedData},
  };
};

export const useSerializedData = <Type extends Datatype['type']>(
  type?: Type,
): Serialized<Extract<Datatype, {type: Type}>>[] => {
  const {serializedData} = React.useContext(SerializedDataContext);
  if (type === undefined || serializedData[0].type === type) {
    return serializedData as Serialized<Extract<Datatype, {type: Type}>>[];
  }
  throw new Error(
    `Serialized data type mismatch: ${serializedData[0].type} !== ${type}`,
  );
};

export const useSerializedDataAPI = (): SerializedDataAPI =>
  React.useContext(SerializedDataContext).api;

const isSerializedDataChangeMessage = (
  message: unknown,
): message is SerializedDataChangeMessage => message === SERIALIZED_DATA_CHANGE;
