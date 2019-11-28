module.exports = page => {
  page.addStyleTag({ content: '* { color: transparent !important; }' });
  return page.screenshot();
};
