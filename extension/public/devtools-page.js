//@ts-check
/// <reference types="chrome" />

// biome-ignore lint/style/noRestrictedGlobals:
chrome.devtools.panels.elements.createSidebarPane(
  'Floating UI',
  (sidebarPanel) => {
    sidebarPanel.setPage('index.html');
  },
);
