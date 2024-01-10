import type {Middleware, MiddlewareState} from '@floating-ui/dom';
import type {FloatingUIMiddlewareData} from '../../../extension/src/views/floating-ui';
import {getController} from './controller';
import type {Metadata, MiddlewareData} from './types';
import {
  ELEMENT_METADATA,
  SERIALIZED_DATA_CHANGE,
} from 'extension/utils/constants';
import {serialize} from './utils/serialize';
import {isHTMLElementWithMetadata} from './utils/isHTMLElement';
import {createReferences} from 'extension/utils/references';

/**
 * devtools middleware
 * @public
 */
export const devtools = (
  targetDocument = document,
  middlewareDataCallback: (
    state: MiddlewareState,
  ) => MiddlewareData = floatingUIMiddlewareDataCallback,
): Middleware => ({
  name: '@floating-ui/devtools',
  fn: (state: MiddlewareState) => {
    const {[ELEMENT_METADATA]: metadata} = isHTMLElementWithMetadata(
      state.elements.floating,
    )
      ? state.elements.floating
      : Object.assign<HTMLElement, {[ELEMENT_METADATA]: Metadata}>(
          state.elements.floating,
          {
            [ELEMENT_METADATA]: {
              references: createReferences(),
              serializedData: [],
            },
          },
        );

    const serializedData = serialize(
      middlewareDataCallback(state),
      metadata.references,
    );
    metadata.serializedData.unshift(serializedData);

    const controller = getController(targetDocument);

    if (
      metadata.serializedData.length > 1 &&
      state.elements.floating === controller?.selectedElement
    ) {
      targetDocument.defaultView?.postMessage(SERIALIZED_DATA_CHANGE);
    }

    return {};
  },
});

const floatingUIMiddlewareDataCallback = (
  state: MiddlewareState,
): FloatingUIMiddlewareData => ({
  ...state,
  type: 'FloatingUIMiddleware',
});
