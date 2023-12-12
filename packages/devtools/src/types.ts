import type {CONTROLLER, ELEMENT_METADATA} from 'extension/utils/constants';

import type {Controller} from './controller';
import type {References} from './utils/references';

/**
 * @public
 */
export type MiddlewareData = {type: `${string}Middleware`};

export type Data = {type: string};

export type MiddlewareMetadata = {
  type: 'middleware';
  serializedData: MiddlewareData;
  references: References;
};

export type Metadata = {
  type: string;
  serializedData: object;
  references: References;
};

export interface HTMLElementWithMetadata extends HTMLElement {
  [ELEMENT_METADATA]: Metadata;
}

declare global {
  interface Window {
    [CONTROLLER]: Controller;
  }
}
