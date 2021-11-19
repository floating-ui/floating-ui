export const screenshot = async page => {
  await page.addStyleTag({ content: '* { color: transparent !important; }' });
  return page.screenshot();
};

/* istanbul ignore next */
export const scroll = async (page, selector, amount) => {
  const scrollTop = await page.$eval(selector, element => element.scrollTop);

  await page.$eval(
    selector,
    (element, amount, scrollTop) => (element.scrollTop = scrollTop + amount),
    amount,
    scrollTop
  );

  await page.waitForFunction(
    (selector, scrollTop, amount) =>
      document.querySelector(selector).scrollTop === scrollTop + amount,
    {},
    selector,
    scrollTop,
    amount
  );
};
