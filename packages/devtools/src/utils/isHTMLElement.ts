import {ELEMENT_METADATA} from 'extension/utils/constants';
import type {HTMLElementWithMetadata} from '../types';

/**
 * Verifies if a given node is an HTMLElement,
 * this method works seamlessly with frames and elements from different documents
 *
 * This is preferred over simply using `instanceof`.
 * Since `instanceof` might be problematic while operating with [multiple realms](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof#instanceof_and_multiple_realms)
 *
 * @example
 * ```ts
 * isHTMLElement(event.target) && event.target.focus()
 * isHTMLElement(event.target, {constructorName: 'HTMLInputElement'}) && event.target.value // some value
 * ```
 *
 */
export function isHTMLElement<
  ConstructorName extends HTMLElementConstructorName = 'HTMLElement',
>(
  element?: unknown,
  options?: {
    /**
     * Can be used to provide a custom constructor instead of `HTMLElement`,
     * Like `HTMLInputElement` for example.
     */
    constructorName?: ConstructorName;
  },
): element is InstanceType<(typeof globalThis)[ConstructorName]> {
  const typedElement = element as Node | null | undefined;
  return Boolean(
    typedElement?.ownerDocument?.defaultView &&
      typedElement instanceof
        typedElement.ownerDocument.defaultView[
          options?.constructorName ?? 'HTMLElement'
        ],
  );
}

/**
 * @internal
 */
export type HTMLElementConstructorName =
  | 'HTMLElement'
  | 'HTMLAnchorElement'
  | 'HTMLAreaElement'
  | 'HTMLAudioElement'
  | 'HTMLBaseElement'
  | 'HTMLBodyElement'
  | 'HTMLBRElement'
  | 'HTMLButtonElement'
  | 'HTMLCanvasElement'
  | 'HTMLDataElement'
  | 'HTMLDataListElement'
  | 'HTMLDetailsElement'
  // NOTE: dialog is not supported in safari 14, also it was removed from lib-dom starting typescript 4.4
  // | 'HTMLDialogElement'
  | 'HTMLDivElement'
  | 'HTMLDListElement'
  | 'HTMLEmbedElement'
  | 'HTMLFieldSetElement'
  | 'HTMLFormElement'
  | 'HTMLHeadingElement'
  | 'HTMLHeadElement'
  | 'HTMLHRElement'
  | 'HTMLHtmlElement'
  | 'HTMLIFrameElement'
  | 'HTMLImageElement'
  | 'HTMLInputElement'
  | 'HTMLModElement'
  | 'HTMLLabelElement'
  | 'HTMLLegendElement'
  | 'HTMLLIElement'
  | 'HTMLLinkElement'
  | 'HTMLMapElement'
  | 'HTMLMetaElement'
  | 'HTMLMeterElement'
  | 'HTMLObjectElement'
  | 'HTMLOListElement'
  | 'HTMLOptGroupElement'
  | 'HTMLOptionElement'
  | 'HTMLOutputElement'
  | 'HTMLParagraphElement'
  | 'HTMLParamElement'
  | 'HTMLPreElement'
  | 'HTMLProgressElement'
  | 'HTMLQuoteElement'
  | 'HTMLSlotElement'
  | 'HTMLScriptElement'
  | 'HTMLSelectElement'
  | 'HTMLSourceElement'
  | 'HTMLSpanElement'
  | 'HTMLStyleElement'
  | 'HTMLTableElement'
  | 'HTMLTableColElement'
  | 'HTMLTableRowElement'
  | 'HTMLTableSectionElement'
  | 'HTMLTemplateElement'
  | 'HTMLTextAreaElement'
  | 'HTMLTimeElement'
  | 'HTMLTitleElement'
  | 'HTMLTrackElement'
  | 'HTMLUListElement'
  | 'HTMLVideoElement';

export const isHTMLElementWithMetadata = (
  element?: HTMLElement | null,
): element is HTMLElementWithMetadata & {parentElement: HTMLElement} =>
  Boolean(
    isHTMLElement(element) &&
      ELEMENT_METADATA in element &&
      element.parentElement !== null,
  );
