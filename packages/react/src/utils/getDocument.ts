export function getDocument(floating: HTMLElement | null) {
  return floating?.ownerDocument ?? document;
}
