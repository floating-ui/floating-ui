//@ts-check
/// <reference types="chrome" />

chrome.devtools.panels.elements.createSidebarPane(
  'Floating UI',
  (sidebarPanel) => {
    sidebarPanel.setPage('index.html');
  },
);
