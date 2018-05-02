// @flow

// This sucks, but it's the only way to "extend" a builtin type
// Copied from https://github.com/facebook/flow/blob/master/lib/dom.js
declare class Document extends Node {
  URL: string;
  adoptNode<T: Node>(source: T): T;
  anchors: HTMLCollection<HTMLAnchorElement>;
  applets: HTMLCollection<HTMLAppletElement>;
  body: HTMLBodyElement;
  characterSet: string;
  close(): void;
  cookie: string;
  createAttribute(name: string): Attr;
  createAttributeNS(namespaceURI: string | null, qualifiedName: string): Attr;
  createCDATASection(data: string): Text;
  createComment(data: string): Comment;
  createDocumentFragment(): DocumentFragment;
  createElement(tagName: 'a'): HTMLAnchorElement;
  createElement(tagName: 'area'): HTMLAreaElement;
  createElement(tagName: 'audio'): HTMLAudioElement;
  createElement(tagName: 'blockquote'): HTMLQuoteElement;
  createElement(tagName: 'body'): HTMLBodyElement;
  createElement(tagName: 'br'): HTMLBRElement;
  createElement(tagName: 'button'): HTMLButtonElement;
  createElement(tagName: 'canvas'): HTMLCanvasElement;
  createElement(tagName: 'col'): HTMLTableColElement;
  createElement(tagName: 'colgroup'): HTMLTableColElement;
  createElement(tagName: 'data'): HTMLDataElement;
  createElement(tagName: 'datalist'): HTMLDataListElement;
  createElement(tagName: 'del'): HTMLModElement;
  createElement(tagName: 'details'): HTMLDetailsElement;
  createElement(tagName: 'dialog'): HTMLDialogElement;
  createElement(tagName: 'div'): HTMLDivElement;
  createElement(tagName: 'dl'): HTMLDListElement;
  createElement(tagName: 'embed'): HTMLEmbedElement;
  createElement(tagName: 'fieldset'): HTMLFieldSetElement;
  createElement(tagName: 'form'): HTMLFormElement;
  createElement(
    tagName: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  ): HTMLHeadingElement;
  createElement(tagName: 'head'): HTMLHeadElement;
  createElement(tagName: 'hr'): HTMLHRElement;
  createElement(tagName: 'html'): HTMLHtmlElement;
  createElement(tagName: 'iframe'): HTMLIFrameElement;
  createElement(tagName: 'img'): HTMLImageElement;
  createElement(tagName: 'input'): HTMLInputElement;
  createElement(tagName: 'ins'): HTMLModElement;
  createElement(tagName: 'label'): HTMLLabelElement;
  createElement(tagName: 'legend'): HTMLLegendElement;
  createElement(tagName: 'li'): HTMLLIElement;
  createElement(tagName: 'link'): HTMLLinkElement;
  createElement(tagName: 'map'): HTMLMapElement;
  createElement(tagName: 'meta'): HTMLMetaElement;
  createElement(tagName: 'meter'): HTMLMeterElement;
  createElement(tagName: 'object'): HTMLObjectElement;
  createElement(tagName: 'ol'): HTMLOListElement;
  createElement(tagName: 'optgroup'): HTMLOptGroupElement;
  createElement(tagName: 'option'): HTMLOptionElement;
  createElement(tagName: 'p'): HTMLParagraphElement;
  createElement(tagName: 'param'): HTMLParamElement;
  createElement(tagName: 'picture'): HTMLPictureElement;
  createElement(tagName: 'pre'): HTMLPreElement;
  createElement(tagName: 'progress'): HTMLProgressElement;
  createElement(tagName: 'q'): HTMLQuoteElement;
  createElement(tagName: 'script'): HTMLScriptElement;
  createElement(tagName: 'select'): HTMLSelectElement;
  createElement(tagName: 'source'): HTMLSourceElement;
  createElement(tagName: 'span'): HTMLSpanElement;
  createElement(tagName: 'style'): HTMLStyleElement;
  createElement(tagName: 'textarea'): HTMLTextAreaElement;
  createElement(tagName: 'time'): HTMLTimeElement;
  createElement(tagName: 'title'): HTMLTitleElement;
  createElement(tagName: 'track'): HTMLTrackElement;
  createElement(tagName: 'video'): HTMLVideoElement;
  createElement(tagName: 'table'): HTMLTableElement;
  createElement(tagName: 'caption'): HTMLTableCaptionElement;
  createElement(tagName: 'thead' | 'tfoot' | 'tbody'): HTMLTableSectionElement;
  createElement(tagName: 'tr'): HTMLTableRowElement;
  createElement(tagName: 'td' | 'th'): HTMLTableCellElement;
  createElement(tagName: 'template'): HTMLTemplateElement;
  createElement(tagName: 'ul'): HTMLUListElement;
  createElement(tagName: string): HTMLElement;
  createElementNS(namespaceURI: string | null, qualifiedName: string): Element;
  createTextNode(data: string): Text;
  currentScript: HTMLScriptElement | null;
  doctype: DocumentType | null;
  documentElement: HTMLElement;
  documentMode: number;
  domain: string | null;
  embeds: HTMLCollection<HTMLEmbedElement>;
  execCommand(cmdID: string, showUI?: boolean, value?: any): boolean;
  forms: HTMLCollection<HTMLFormElement>;
  getElementById(elementId: string): HTMLElement | null;
  getElementsByClassName(classNames: string): HTMLCollection<HTMLElement>;
  getElementsByName(elementName: string): HTMLCollection<HTMLElement>;
  getElementsByTagName(name: 'a'): HTMLCollection<HTMLAnchorElement>;
  getElementsByTagName(name: 'area'): HTMLCollection<HTMLAreaElement>;
  getElementsByTagName(name: 'audio'): HTMLCollection<HTMLAudioElement>;
  getElementsByTagName(name: 'blockquote'): HTMLCollection<HTMLQuoteElement>;
  getElementsByTagName(name: 'body'): HTMLCollection<HTMLBodyElement>;
  getElementsByTagName(name: 'br'): HTMLCollection<HTMLBRElement>;
  getElementsByTagName(name: 'button'): HTMLCollection<HTMLButtonElement>;
  getElementsByTagName(name: 'canvas'): HTMLCollection<HTMLCanvasElement>;
  getElementsByTagName(name: 'col'): HTMLCollection<HTMLTableColElement>;
  getElementsByTagName(name: 'colgroup'): HTMLCollection<HTMLTableColElement>;
  getElementsByTagName(name: 'data'): HTMLCollection<HTMLDataElement>;
  getElementsByTagName(name: 'datalist'): HTMLCollection<HTMLDataListElement>;
  getElementsByTagName(name: 'del'): HTMLCollection<HTMLModElement>;
  getElementsByTagName(name: 'details'): HTMLCollection<HTMLDetailsElement>;
  getElementsByTagName(name: 'dialog'): HTMLCollection<HTMLDialogElement>;
  getElementsByTagName(name: 'div'): HTMLCollection<HTMLDivElement>;
  getElementsByTagName(name: 'dl'): HTMLCollection<HTMLDListElement>;
  getElementsByTagName(name: 'embed'): HTMLCollection<HTMLEmbedElement>;
  getElementsByTagName(name: 'fieldset'): HTMLCollection<HTMLFieldSetElement>;
  getElementsByTagName(name: 'form'): HTMLCollection<HTMLFormElement>;
  getElementsByTagName(
    name: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  ): HTMLCollection<HTMLHeadingElement>;
  getElementsByTagName(name: 'head'): HTMLCollection<HTMLHeadElement>;
  getElementsByTagName(name: 'hr'): HTMLCollection<HTMLHRElement>;
  getElementsByTagName(name: 'html'): HTMLCollection<HTMLHtmlElement>;
  getElementsByTagName(name: 'iframe'): HTMLCollection<HTMLIFrameElement>;
  getElementsByTagName(name: 'img'): HTMLCollection<HTMLImageElement>;
  getElementsByTagName(name: 'input'): HTMLCollection<HTMLInputElement>;
  getElementsByTagName(name: 'ins'): HTMLCollection<HTMLModElement>;
  getElementsByTagName(name: 'label'): HTMLCollection<HTMLLabelElement>;
  getElementsByTagName(name: 'legend'): HTMLCollection<HTMLLegendElement>;
  getElementsByTagName(name: 'li'): HTMLCollection<HTMLLIElement>;
  getElementsByTagName(name: 'link'): HTMLCollection<HTMLLinkElement>;
  getElementsByTagName(name: 'map'): HTMLCollection<HTMLMapElement>;
  getElementsByTagName(name: 'meta'): HTMLCollection<HTMLMetaElement>;
  getElementsByTagName(name: 'meter'): HTMLCollection<HTMLMeterElement>;
  getElementsByTagName(name: 'object'): HTMLCollection<HTMLObjectElement>;
  getElementsByTagName(name: 'ol'): HTMLCollection<HTMLOListElement>;
  getElementsByTagName(name: 'option'): HTMLCollection<HTMLOptionElement>;
  getElementsByTagName(name: 'optgroup'): HTMLCollection<HTMLOptGroupElement>;
  getElementsByTagName(name: 'p'): HTMLCollection<HTMLParagraphElement>;
  getElementsByTagName(name: 'param'): HTMLCollection<HTMLParamElement>;
  getElementsByTagName(name: 'picture'): HTMLCollection<HTMLPictureElement>;
  getElementsByTagName(name: 'pre'): HTMLCollection<HTMLPreElement>;
  getElementsByTagName(name: 'progress'): HTMLCollection<HTMLProgressElement>;
  getElementsByTagName(name: 'q'): HTMLCollection<HTMLQuoteElement>;
  getElementsByTagName(name: 'script'): HTMLCollection<HTMLScriptElement>;
  getElementsByTagName(name: 'select'): HTMLCollection<HTMLSelectElement>;
  getElementsByTagName(name: 'source'): HTMLCollection<HTMLSourceElement>;
  getElementsByTagName(name: 'span'): HTMLCollection<HTMLSpanElement>;
  getElementsByTagName(name: 'style'): HTMLCollection<HTMLStyleElement>;
  getElementsByTagName(name: 'textarea'): HTMLCollection<HTMLTextAreaElement>;
  getElementsByTagName(name: 'time'): HTMLCollection<HTMLTimeElement>;
  getElementsByTagName(name: 'title'): HTMLCollection<HTMLTitleElement>;
  getElementsByTagName(name: 'track'): HTMLCollection<HTMLTrackElement>;
  getElementsByTagName(name: 'video'): HTMLCollection<HTMLVideoElement>;
  getElementsByTagName(name: 'table'): HTMLCollection<HTMLTableElement>;
  getElementsByTagName(
    name: 'caption'
  ): HTMLCollection<HTMLTableCaptionElement>;
  getElementsByTagName(
    name: 'thead' | 'tfoot' | 'tbody'
  ): HTMLCollection<HTMLTableSectionElement>;
  getElementsByTagName(name: 'tr'): HTMLCollection<HTMLTableRowElement>;
  getElementsByTagName(name: 'td' | 'th'): HTMLCollection<HTMLTableCellElement>;
  getElementsByTagName(name: 'template'): HTMLCollection<HTMLTemplateElement>;
  getElementsByTagName(name: 'ul'): HTMLCollection<HTMLUListElement>;
  getElementsByTagName(name: string): HTMLCollection<HTMLElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'a'
  ): HTMLCollection<HTMLAnchorElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'area'
  ): HTMLCollection<HTMLAreaElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'audio'
  ): HTMLCollection<HTMLAudioElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'blockquote'
  ): HTMLCollection<HTMLQuoteElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'body'
  ): HTMLCollection<HTMLBodyElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'br'
  ): HTMLCollection<HTMLBRElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'button'
  ): HTMLCollection<HTMLButtonElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'canvas'
  ): HTMLCollection<HTMLCanvasElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'col'
  ): HTMLCollection<HTMLTableColElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'colgroup'
  ): HTMLCollection<HTMLTableColElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'data'
  ): HTMLCollection<HTMLDataElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'datalist'
  ): HTMLCollection<HTMLDataListElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'del'
  ): HTMLCollection<HTMLModElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'details'
  ): HTMLCollection<HTMLDetailsElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'dialog'
  ): HTMLCollection<HTMLDialogElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'div'
  ): HTMLCollection<HTMLDivElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'dl'
  ): HTMLCollection<HTMLDListElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'embed'
  ): HTMLCollection<HTMLEmbedElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'fieldset'
  ): HTMLCollection<HTMLFieldSetElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'form'
  ): HTMLCollection<HTMLFormElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  ): HTMLCollection<HTMLHeadingElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'head'
  ): HTMLCollection<HTMLHeadElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'hr'
  ): HTMLCollection<HTMLHRElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'html'
  ): HTMLCollection<HTMLHtmlElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'iframe'
  ): HTMLCollection<HTMLIFrameElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'img'
  ): HTMLCollection<HTMLImageElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'input'
  ): HTMLCollection<HTMLInputElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'ins'
  ): HTMLCollection<HTMLModElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'label'
  ): HTMLCollection<HTMLLabelElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'legend'
  ): HTMLCollection<HTMLLegendElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'li'
  ): HTMLCollection<HTMLLIElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'link'
  ): HTMLCollection<HTMLLinkElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'map'
  ): HTMLCollection<HTMLMapElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'meta'
  ): HTMLCollection<HTMLMetaElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'meter'
  ): HTMLCollection<HTMLMeterElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'object'
  ): HTMLCollection<HTMLObjectElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'ol'
  ): HTMLCollection<HTMLOListElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'option'
  ): HTMLCollection<HTMLOptionElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'optgroup'
  ): HTMLCollection<HTMLOptGroupElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'p'
  ): HTMLCollection<HTMLParagraphElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'param'
  ): HTMLCollection<HTMLParamElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'picture'
  ): HTMLCollection<HTMLPictureElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'pre'
  ): HTMLCollection<HTMLPreElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'progress'
  ): HTMLCollection<HTMLProgressElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'q'
  ): HTMLCollection<HTMLQuoteElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'script'
  ): HTMLCollection<HTMLScriptElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'select'
  ): HTMLCollection<HTMLSelectElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'source'
  ): HTMLCollection<HTMLSourceElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'span'
  ): HTMLCollection<HTMLSpanElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'style'
  ): HTMLCollection<HTMLStyleElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'textarea'
  ): HTMLCollection<HTMLTextAreaElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'time'
  ): HTMLCollection<HTMLTimeElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'title'
  ): HTMLCollection<HTMLTitleElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'track'
  ): HTMLCollection<HTMLTrackElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'video'
  ): HTMLCollection<HTMLVideoElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'table'
  ): HTMLCollection<HTMLTableElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'caption'
  ): HTMLCollection<HTMLTableCaptionElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'thead' | 'tfoot' | 'tbody'
  ): HTMLCollection<HTMLTableSectionElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'tr'
  ): HTMLCollection<HTMLTableRowElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'td' | 'th'
  ): HTMLCollection<HTMLTableCellElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'template'
  ): HTMLCollection<HTMLTemplateElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: 'ul'
  ): HTMLCollection<HTMLUListElement>;
  getElementsByTagNameNS(
    namespaceURI: string | null,
    localName: string
  ): HTMLCollection<HTMLElement>;
  head: HTMLElement | null;
  images: HTMLCollection<HTMLImageElement>;
  implementation: DOMImplementation;
  importNode<T: Node>(importedNode: T, deep: boolean): T;
  inputEncoding: string;
  lastModified: string;
  links: HTMLCollection<HTMLLinkElement>;
  media: string;
  open(url?: string, name?: string, features?: string, replace?: boolean): any;
  readyState: string;
  referrer: string;
  scripts: HTMLCollection<HTMLScriptElement>;
  styleSheets: StyleSheetList;
  title: string;
  visibilityState: 'visible' | 'hidden' | 'prerender' | 'unloaded';
  write(...content: Array<string>): void;
  writeln(...content: Array<string>): void;
  xmlEncoding: string;
  xmlStandalone: boolean;
  xmlVersion: string;

  registerElement(type: string, options?: ElementRegistrationOptions): any;
  getSelection(): Selection | null;

  // 6.4.6 Focus management APIs
  activeElement: HTMLElement | null;
  hasFocus(): boolean;

  // extension
  location: Location;
  createEvent(eventInterface: 'CustomEvent'): CustomEvent;
  createEvent(eventInterface: string): Event;
  createRange(): Range;
  elementFromPoint(x: number, y: number): HTMLElement;
  defaultView: any;
  compatMode: 'BackCompat' | 'CSS1Compat';
  hidden: boolean;

  // from ParentNode interface
  childElementCount: number;
  children: HTMLCollection<HTMLElement>;
  firstElementChild: ?Element;
  lastElementChild: ?Element;
  append(...nodes: Array<string | Node>): void;
  prepend(...nodes: Array<string | Node>): void;

  querySelector(selector: 'a'): HTMLAnchorElement | null;
  querySelector(selector: 'area'): HTMLAreaElement | null;
  querySelector(selector: 'audio'): HTMLAudioElement | null;
  querySelector(selector: 'blockquote'): HTMLQuoteElement | null;
  querySelector(selector: 'body'): HTMLBodyElement | null;
  querySelector(selector: 'br'): HTMLBRElement | null;
  querySelector(selector: 'button'): HTMLButtonElement | null;
  querySelector(selector: 'canvas'): HTMLCanvasElement | null;
  querySelector(selector: 'col'): HTMLTableColElement | null;
  querySelector(selector: 'colgroup'): HTMLTableColElement | null;
  querySelector(selector: 'data'): HTMLDataElement | null;
  querySelector(selector: 'datalist'): HTMLDataListElement | null;
  querySelector(selector: 'del'): HTMLModElement | null;
  querySelector(selector: 'details'): HTMLDetailsElement | null;
  querySelector(selector: 'dialog'): HTMLDialogElement | null;
  querySelector(selector: 'div'): HTMLDivElement | null;
  querySelector(selector: 'dl'): HTMLDListElement | null;
  querySelector(selector: 'embed'): HTMLEmbedElement | null;
  querySelector(selector: 'fieldset'): HTMLFieldSetElement | null;
  querySelector(selector: 'form'): HTMLFormElement | null;
  querySelector(
    selector: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  ): HTMLHeadingElement;
  querySelector(selector: 'head'): HTMLHeadElement | null;
  querySelector(selector: 'hr'): HTMLHRElement | null;
  querySelector(selector: 'html'): HTMLHtmlElement | null;
  querySelector(selector: 'iframe'): HTMLIFrameElement | null;
  querySelector(selector: 'img'): HTMLImageElement | null;
  querySelector(selector: 'ins'): HTMLModElement | null;
  querySelector(selector: 'input'): HTMLInputElement | null;
  querySelector(selector: 'label'): HTMLLabelElement | null;
  querySelector(selector: 'legend'): HTMLLegendElement | null;
  querySelector(selector: 'li'): HTMLLIElement | null;
  querySelector(selector: 'link'): HTMLLinkElement | null;
  querySelector(selector: 'map'): HTMLMapElement | null;
  querySelector(selector: 'meta'): HTMLMetaElement | null;
  querySelector(selector: 'meter'): HTMLMeterElement | null;
  querySelector(selector: 'object'): HTMLObjectElement | null;
  querySelector(selector: 'ol'): HTMLOListElement | null;
  querySelector(selector: 'option'): HTMLOptionElement | null;
  querySelector(selector: 'optgroup'): HTMLOptGroupElement | null;
  querySelector(selector: 'p'): HTMLParagraphElement | null;
  querySelector(selector: 'param'): HTMLParamElement | null;
  querySelector(selector: 'picture'): HTMLPictureElement | null;
  querySelector(selector: 'pre'): HTMLPreElement | null;
  querySelector(selector: 'progress'): HTMLProgressElement | null;
  querySelector(selector: 'q'): HTMLQuoteElement | null;
  querySelector(selector: 'script'): HTMLScriptElement | null;
  querySelector(selector: 'select'): HTMLSelectElement | null;
  querySelector(selector: 'source'): HTMLSourceElement | null;
  querySelector(selector: 'span'): HTMLSpanElement | null;
  querySelector(selector: 'style'): HTMLStyleElement | null;
  querySelector(selector: 'textarea'): HTMLTextAreaElement | null;
  querySelector(selector: 'time'): HTMLTimeElement | null;
  querySelector(selector: 'title'): HTMLTitleElement | null;
  querySelector(selector: 'track'): HTMLTrackElement | null;
  querySelector(selector: 'video'): HTMLVideoElement | null;
  querySelector(selector: 'table'): HTMLTableElement | null;
  querySelector(selector: 'caption'): HTMLTableCaptionElement | null;
  querySelector(
    selector: 'thead' | 'tfoot' | 'tbody'
  ): HTMLTableSectionElement | null;
  querySelector(selector: 'tr'): HTMLTableRowElement | null;
  querySelector(selector: 'td' | 'th'): HTMLTableCellElement | null;
  querySelector(selector: 'template'): HTMLTemplateElement | null;
  querySelector(selector: 'ul'): HTMLUListElement | null;
  querySelector(selector: string): HTMLElement | null;

  querySelectorAll(selector: 'a'): NodeList<HTMLAnchorElement>;
  querySelectorAll(selector: 'area'): NodeList<HTMLAreaElement>;
  querySelectorAll(selector: 'audio'): NodeList<HTMLAudioElement>;
  querySelectorAll(selector: 'blockquote'): NodeList<HTMLQuoteElement>;
  querySelectorAll(selector: 'body'): NodeList<HTMLBodyElement>;
  querySelectorAll(selector: 'br'): NodeList<HTMLBRElement>;
  querySelectorAll(selector: 'button'): NodeList<HTMLButtonElement>;
  querySelectorAll(selector: 'canvas'): NodeList<HTMLCanvasElement>;
  querySelectorAll(selector: 'col'): NodeList<HTMLTableColElement>;
  querySelectorAll(selector: 'colgroup'): NodeList<HTMLTableColElement>;
  querySelectorAll(selector: 'data'): NodeList<HTMLDataElement>;
  querySelectorAll(selector: 'datalist'): NodeList<HTMLDataListElement>;
  querySelectorAll(selector: 'del'): NodeList<HTMLModElement>;
  querySelectorAll(selector: 'details'): NodeList<HTMLDetailsElement>;
  querySelectorAll(selector: 'dialog'): NodeList<HTMLDialogElement>;
  querySelectorAll(selector: 'div'): NodeList<HTMLDivElement>;
  querySelectorAll(selector: 'dl'): NodeList<HTMLDListElement>;
  querySelectorAll(selector: 'embed'): NodeList<HTMLEmbedElement>;
  querySelectorAll(selector: 'fieldset'): NodeList<HTMLFieldSetElement>;
  querySelectorAll(selector: 'form'): NodeList<HTMLFormElement>;
  querySelectorAll(
    selector: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  ): NodeList<HTMLHeadingElement>;
  querySelectorAll(selector: 'head'): NodeList<HTMLHeadElement>;
  querySelectorAll(selector: 'hr'): NodeList<HTMLHRElement>;
  querySelectorAll(selector: 'html'): NodeList<HTMLHtmlElement>;
  querySelectorAll(selector: 'iframe'): NodeList<HTMLIFrameElement>;
  querySelectorAll(selector: 'img'): NodeList<HTMLImageElement>;
  querySelectorAll(selector: 'input'): NodeList<HTMLInputElement>;
  querySelectorAll(selector: 'ins'): NodeList<HTMLModElement>;
  querySelectorAll(selector: 'label'): NodeList<HTMLLabelElement>;
  querySelectorAll(selector: 'legend'): NodeList<HTMLLegendElement>;
  querySelectorAll(selector: 'li'): NodeList<HTMLLIElement>;
  querySelectorAll(selector: 'link'): NodeList<HTMLLinkElement>;
  querySelectorAll(selector: 'map'): NodeList<HTMLMapElement>;
  querySelectorAll(selector: 'meta'): NodeList<HTMLMetaElement>;
  querySelectorAll(selector: 'meter'): NodeList<HTMLMeterElement>;
  querySelectorAll(selector: 'object'): NodeList<HTMLObjectElement>;
  querySelectorAll(selector: 'ol'): NodeList<HTMLOListElement>;
  querySelectorAll(selector: 'option'): NodeList<HTMLOptionElement>;
  querySelectorAll(selector: 'optgroup'): NodeList<HTMLOptGroupElement>;
  querySelectorAll(selector: 'p'): NodeList<HTMLParagraphElement>;
  querySelectorAll(selector: 'param'): NodeList<HTMLParamElement>;
  querySelectorAll(selector: 'picture'): NodeList<HTMLPictureElement>;
  querySelectorAll(selector: 'pre'): NodeList<HTMLPreElement>;
  querySelectorAll(selector: 'progress'): NodeList<HTMLProgressElement>;
  querySelectorAll(selector: 'q'): NodeList<HTMLQuoteElement>;
  querySelectorAll(selector: 'script'): NodeList<HTMLScriptElement>;
  querySelectorAll(selector: 'select'): NodeList<HTMLSelectElement>;
  querySelectorAll(selector: 'source'): NodeList<HTMLSourceElement>;
  querySelectorAll(selector: 'span'): NodeList<HTMLSpanElement>;
  querySelectorAll(selector: 'style'): NodeList<HTMLStyleElement>;
  querySelectorAll(selector: 'textarea'): NodeList<HTMLTextAreaElement>;
  querySelectorAll(selector: 'time'): NodeList<HTMLTimeElement>;
  querySelectorAll(selector: 'title'): NodeList<HTMLTitleElement>;
  querySelectorAll(selector: 'track'): NodeList<HTMLTrackElement>;
  querySelectorAll(selector: 'video'): NodeList<HTMLVideoElement>;
  querySelectorAll(selector: 'table'): NodeList<HTMLTableElement>;
  querySelectorAll(selector: 'caption'): NodeList<HTMLTableCaptionElement>;
  querySelectorAll(
    selector: 'thead' | 'tfoot' | 'tbody'
  ): NodeList<HTMLTableSectionElement>;
  querySelectorAll(selector: 'tr'): NodeList<HTMLTableRowElement>;
  querySelectorAll(selector: 'td' | 'th'): NodeList<HTMLTableCellElement>;
  querySelectorAll(selector: 'template'): NodeList<HTMLTemplateElement>;
  querySelectorAll(selector: 'ul'): NodeList<HTMLUListElement>;
  querySelectorAll(selector: string): NodeList<HTMLElement>;

  // Interface DocumentTraversal
  // http://www.w3.org/TR/2000/REC-DOM-Level-2-Traversal-Range-20001113/traversal.html#Traversal-Document

  // Not all combinations of RootNodeT and whatToShow are logically possible.
  // The bitmasks NodeFilter.SHOW_CDATA_SECTION,
  // NodeFilter.SHOW_ENTITY_REFERENCE, NodeFilter.SHOW_ENTITY, and
  // NodeFilter.SHOW_NOTATION are deprecated and do not correspond to types
  // that Flow knows about.

  // NodeFilter.SHOW_ATTRIBUTE is also deprecated, but corresponds to the
  // type Attr. While there is no reason to prefer it to Node.attributes,
  // it does have meaning and can be typed: When (whatToShow &
  // NodeFilter.SHOW_ATTRIBUTE === 1), RootNodeT must be Attr, and when
  // RootNodeT is Attr, bitmasks other than NodeFilter.SHOW_ATTRIBUTE are
  // meaningless.
  createNodeIterator<RootNodeT: Attr>(
    root: RootNodeT,
    whatToShow: 2,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, Attr>;
  createTreeWalker<RootNodeT: Attr>(
    root: RootNodeT,
    whatToShow: 2,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, Attr>;

  // NodeFilter.SHOW_PROCESSING_INSTRUCTION is not implemented because Flow
  // does not currently define a ProcessingInstruction class.

  // When (whatToShow & NodeFilter.SHOW_DOCUMENT === 1 || whatToShow &
  // NodeFilter.SHOW_DOCUMENT_TYPE === 1), RootNodeT must be Document.
  createNodeIterator<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 256,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, Document>;
  createNodeIterator<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 257,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, Document | Element>;
  createNodeIterator<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 260,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, Document | Text>;
  createNodeIterator<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 261,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, Document | Element | Text>;
  createNodeIterator<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 384,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, Document | Comment>;
  createNodeIterator<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 385,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, Document | Element | Comment>;
  createNodeIterator<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 388,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, Document | Text | Comment>;
  createNodeIterator<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 389,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, Document | Element | Text | Comment>;
  createNodeIterator<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 512,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, DocumentType>;
  createNodeIterator<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 513,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, DocumentType | Element>;
  createNodeIterator<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 516,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, DocumentType | Text>;
  createNodeIterator<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 517,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, DocumentType | Element | Text>;
  createNodeIterator<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 640,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, DocumentType | Comment>;
  createNodeIterator<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 641,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, DocumentType | Element | Comment>;
  createNodeIterator<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 644,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, DocumentType | Text | Comment>;
  createNodeIterator<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 645,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, DocumentType | Element | Text | Comment>;
  createNodeIterator<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 768,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, DocumentType | Document>;
  createNodeIterator<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 769,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, DocumentType | Document | Element>;
  createNodeIterator<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 772,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, DocumentType | Document | Text>;
  createNodeIterator<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 773,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, DocumentType | Document | Element | Text>;
  createNodeIterator<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 896,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, DocumentType | Document | Comment>;
  createNodeIterator<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 897,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, DocumentType | Document | Element | Comment>;
  createNodeIterator<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 900,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, DocumentType | Document | Text | Comment>;
  createNodeIterator<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 901,
    filter?: NodeFilterInterface
  ): NodeIterator<
    RootNodeT,
    DocumentType | Document | Element | Text | Comment
  >;
  createTreeWalker<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 256,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, Document>;
  createTreeWalker<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 257,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, Document | Element>;
  createTreeWalker<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 260,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, Document | Text>;
  createTreeWalker<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 261,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, Document | Element | Text>;
  createTreeWalker<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 384,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, Document | Comment>;
  createTreeWalker<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 385,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, Document | Element | Comment>;
  createTreeWalker<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 388,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, Document | Text | Comment>;
  createTreeWalker<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 389,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, Document | Element | Text | Comment>;
  createTreeWalker<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 512,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, DocumentType>;
  createTreeWalker<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 513,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, DocumentType | Element>;
  createTreeWalker<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 516,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, DocumentType | Text>;
  createTreeWalker<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 517,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, DocumentType | Element | Text>;
  createTreeWalker<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 640,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, DocumentType | Comment>;
  createTreeWalker<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 641,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, DocumentType | Element | Comment>;
  createTreeWalker<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 644,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, DocumentType | Text | Comment>;
  createTreeWalker<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 645,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, DocumentType | Element | Text | Comment>;
  createTreeWalker<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 768,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, DocumentType | Document>;
  createTreeWalker<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 769,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, DocumentType | Document | Element>;
  createTreeWalker<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 772,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, DocumentType | Document | Text>;
  createTreeWalker<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 773,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, DocumentType | Document | Element | Text>;
  createTreeWalker<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 896,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, DocumentType | Document | Comment>;
  createTreeWalker<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 897,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, DocumentType | Document | Element | Comment>;
  createTreeWalker<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 900,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, DocumentType | Document | Text | Comment>;
  createTreeWalker<RootNodeT: Document>(
    root: RootNodeT,
    whatToShow: 901,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, DocumentType | Document | Element | Text | Comment>;

  // When (whatToShow & NodeFilter.SHOW_DOCUMENT_FRAGMENT === 1), RootNodeT
  // must be a DocumentFragment.
  createNodeIterator<RootNodeT: DocumentFragment>(
    root: RootNodeT,
    whatToShow: 1024,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, DocumentFragment>;
  createNodeIterator<RootNodeT: DocumentFragment>(
    root: RootNodeT,
    whatToShow: 1025,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, DocumentFragment | Element>;
  createNodeIterator<RootNodeT: DocumentFragment>(
    root: RootNodeT,
    whatToShow: 1028,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, DocumentFragment | Text>;
  createNodeIterator<RootNodeT: DocumentFragment>(
    root: RootNodeT,
    whatToShow: 1029,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, DocumentFragment | Element | Text>;
  createNodeIterator<RootNodeT: DocumentFragment>(
    root: RootNodeT,
    whatToShow: 1152,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, DocumentFragment | Comment>;
  createNodeIterator<RootNodeT: DocumentFragment>(
    root: RootNodeT,
    whatToShow: 1153,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, DocumentFragment | Element | Comment>;
  createNodeIterator<RootNodeT: DocumentFragment>(
    root: RootNodeT,
    whatToShow: 1156,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, DocumentFragment | Text | Comment>;
  createNodeIterator<RootNodeT: DocumentFragment>(
    root: RootNodeT,
    whatToShow: 1157,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, DocumentFragment | Element | Text | Comment>;
  createTreeWalker<RootNodeT: DocumentFragment>(
    root: RootNodeT,
    whatToShow: 1024,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, DocumentFragment>;
  createTreeWalker<RootNodeT: DocumentFragment>(
    root: RootNodeT,
    whatToShow: 1025,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, DocumentFragment | Element>;
  createTreeWalker<RootNodeT: DocumentFragment>(
    root: RootNodeT,
    whatToShow: 1028,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, DocumentFragment | Text>;
  createTreeWalker<RootNodeT: DocumentFragment>(
    root: RootNodeT,
    whatToShow: 1029,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, DocumentFragment | Element | Text>;
  createTreeWalker<RootNodeT: DocumentFragment>(
    root: RootNodeT,
    whatToShow: 1152,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, DocumentFragment | Comment>;
  createTreeWalker<RootNodeT: DocumentFragment>(
    root: RootNodeT,
    whatToShow: 1153,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, DocumentFragment | Element | Comment>;
  createTreeWalker<RootNodeT: DocumentFragment>(
    root: RootNodeT,
    whatToShow: 1156,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, DocumentFragment | Text | Comment>;
  createTreeWalker<RootNodeT: DocumentFragment>(
    root: RootNodeT,
    whatToShow: 1157,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, DocumentFragment | Element | Text | Comment>;

  // In the general case, RootNodeT may be any Node and whatToShow may be
  // NodeFilter.SHOW_ALL or any combination of NodeFilter.SHOW_ELEMENT,
  // NodeFilter.SHOW_TEXT and/or NodeFilter.SHOW_COMMENT
  createNodeIterator<RootNodeT: Node>(
    root: RootNodeT,
    whatToShow: 1,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, Element>;
  createNodeIterator<RootNodeT: Node>(
    root: RootNodeT,
    whatToShow: 4,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, Text>;
  createNodeIterator<RootNodeT: Node>(
    root: RootNodeT,
    whatToShow: 5,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, Element | Text>;
  createNodeIterator<RootNodeT: Node>(
    root: RootNodeT,
    whatToShow: 128,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, Comment>;
  createNodeIterator<RootNodeT: Node>(
    root: RootNodeT,
    whatToShow: 129,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, Element | Comment>;
  createNodeIterator<RootNodeT: Node>(
    root: RootNodeT,
    whatToShow: 132,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, Text | Comment>;
  createNodeIterator<RootNodeT: Node>(
    root: RootNodeT,
    whatToShow: 133,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, Text | Element | Comment>;
  createTreeWalker<RootNodeT: Node>(
    root: RootNodeT,
    whatToShow: 1,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, Element>;
  createTreeWalker<RootNodeT: Node>(
    root: RootNodeT,
    whatToShow: 4,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, Text>;
  createTreeWalker<RootNodeT: Node>(
    root: RootNodeT,
    whatToShow: 5,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, Element | Text>;
  createTreeWalker<RootNodeT: Node>(
    root: RootNodeT,
    whatToShow: 128,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, Comment>;
  createTreeWalker<RootNodeT: Node>(
    root: RootNodeT,
    whatToShow: 129,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, Element | Comment>;
  createTreeWalker<RootNodeT: Node>(
    root: RootNodeT,
    whatToShow: 132,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, Text | Comment>;
  createTreeWalker<RootNodeT: Node>(
    root: RootNodeT,
    whatToShow: 133,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, Text | Element | Comment>;

  // Catch all for when we don't know the value of `whatToShow`
  // And for when whatToShow is not provided, it is assumed to be SHOW_ALL
  createNodeIterator<RootNodeT: Node>(
    root: RootNodeT,
    whatToShow?: number,
    filter?: NodeFilterInterface
  ): NodeIterator<RootNodeT, Node>;
  createTreeWalker<RootNodeT: Node>(
    root: RootNodeT,
    whatToShow?: number,
    filter?: NodeFilterInterface,
    entityReferenceExpansion?: boolean
  ): TreeWalker<RootNodeT, Node>;
}
