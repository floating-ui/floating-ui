/**
 * @jest-environment puppeteer
 * @flow
 */
import { scroll, screenshot } from '../utils/puppeteer.js';

it('should not overflow when small reference is at edge of boundary', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/shift/edge.html`);

  await scroll(page, '#scroll', 300);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should not be limited earlier than expected with a point reference', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/shift/point.html`);

  await scroll(page, '#scroll', 300);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should not be limited without limitShift modifier', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/shift/no-tether.html`);

  await scroll(page, '#scroll', 1500);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should be prevented from overflowing', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/shift/main.html`);

  await scroll(page, '#scroll', 670);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('(min) should be allowed to overflow once the opposite edges are level', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/shift/main.html`);

  await scroll(page, '#scroll', 780);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('(max) should be allowed to overflow once the opposite edges are level', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/shift/main.html`);

  await scroll(page, '#scroll', 4);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('(min) (start-variation) should be allowed to overflow once the opposite edges are level', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/shift/start-variation.html`);

  await scroll(page, '#scroll', 780);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('(max) (start-variation) should be allowed to overflow once the opposite edges are level', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/shift/start-variation.html`);

  await scroll(page, '#scroll', 4);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('(min) (end-variation) should be allowed to overflow once the opposite edges are level', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/shift/end-variation.html`);

  await scroll(page, '#scroll', 780);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('(max) (end-variation) should be allowed to overflow once the opposite edges are level', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/shift/end-variation.html`);

  await scroll(page, '#scroll', 4);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should not overflow offset parent borders', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/shift/offset-parent-border.html`);

  await scroll(page, '#scroll', 600);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should be inside scroller container', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/shift/body-render.html`);

  await scroll(page, '#scroll', 600);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
