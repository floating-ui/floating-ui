export const screenshot = async page => {
  await page.addStyleTag({ content: '* { color: transparent !important; }' });
  return page.screenshot();
};

export const scroll = async (page, selector, amount) => {
  const scroll = await page.$eval(
    selector,
    (evt, amount) => (evt.scrollTop += amount),
    amount
  );
  await page.waitForFunction(
    (selector, scroll) => document.querySelector(selector).scrollTop === scroll,
    {},
    selector,
    scroll
  );
};
