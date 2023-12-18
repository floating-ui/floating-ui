import {getOverflowAncestors} from '../src/dom';

test('returns all overflow ancestors', () => {
  const overflowScroll = document.createElement('div');
  overflowScroll.style.overflow = 'scroll';
  const overflowHidden = document.createElement('div');
  overflowHidden.style.overflow = 'hidden';
  const test = document.createElement('div');

  overflowScroll.append(overflowHidden);
  overflowHidden.append(test);

  expect(getOverflowAncestors(test)).toEqual([
    overflowHidden,
    overflowScroll,
    window,
  ]);
});

test('does not treat display: inline elements as overflow ancestors', () => {
  const overflowScroll = document.createElement('div');
  overflowScroll.style.overflow = 'scroll';
  overflowScroll.style.display = 'inline';
  const overflowHidden = document.createElement('div');
  overflowHidden.style.overflow = 'hidden';
  overflowHidden.style.display = 'inline';
  const test = document.createElement('div');

  overflowScroll.append(overflowHidden);
  overflowHidden.append(test);

  expect(getOverflowAncestors(test)).toEqual([window]);
});

test('does not treat display: contents elements as overflow ancestors', () => {
  const overflowScroll = document.createElement('div');
  overflowScroll.style.overflow = 'scroll';
  overflowScroll.style.display = 'contents';
  const overflowHidden = document.createElement('div');
  overflowHidden.style.overflow = 'hidden';
  overflowHidden.style.display = 'contents';
  const test = document.createElement('div');

  overflowScroll.append(overflowHidden);
  overflowHidden.append(test);

  expect(getOverflowAncestors(test)).toEqual([window]);
});

test('does treat display: inline-block elements as overflow ancestors', () => {
  const overflowScroll = document.createElement('div');
  overflowScroll.style.overflow = 'scroll';
  overflowScroll.style.display = 'inline-block';
  const overflowHidden = document.createElement('div');
  overflowHidden.style.overflow = 'hidden';
  overflowHidden.style.display = 'inline-block';
  const test = document.createElement('div');

  overflowScroll.append(overflowHidden);
  overflowHidden.append(test);

  expect(getOverflowAncestors(test)).toEqual([
    overflowHidden,
    overflowScroll,
    window,
  ]);
});

test('returns overflow ancestors in iframe parents', () => {
  const scroll = document.createElement('div');
  scroll.style.overflow = 'scroll';
  const iframe = document.createElement('iframe');
  const test = document.createElement('div');

  document.body.append(scroll);
  scroll.append(iframe);
  expect(iframe.contentDocument).not.toBeNull();
  iframe.contentDocument?.body.append(test);

  expect(getOverflowAncestors(test)).toEqual([
    iframe.contentWindow,
    scroll,
    window,
  ]);
});
