//@ts-check
/// <reference types="chrome" />

/**
 * @typedef {import('../src/types').SerializedDataChangeMessage} SerializedDataChangeMessage
 */

window.addEventListener(
  'message',
  (event) => {
    if (event.source !== window || !isSerializedDataChangeMessage(event.data)) {
      return;
    }
    // biome-ignore lint/style/noRestrictedGlobals:
    chrome.runtime.sendMessage(event.data);
  },
  false,
);

/**
 *
 * @param {unknown} message
 * @returns {message is SerializedDataChangeMessage}
 */
const isSerializedDataChangeMessage = (message) =>
  message === SERIALIZED_DATA_CHANGE;

/**
 * @type {SerializedDataChangeMessage}
 */
const SERIALIZED_DATA_CHANGE = '__FUIDT_SERIALIZED_DATA_CHANGE__';
