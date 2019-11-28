module.exports = async page => {
  await page.addStyleTag({ content: '* { color: transparent !important; }' });
  return page.screenshot();
};
