// @flow
import mergeByName from './mergeByName';

it('deep merges an array of modifiers by their name', () => {
  const modifiers = [
    {
      name: 'preventOverflow',
      enabled: true,
      options: { tether: false },
    },
    {
      name: 'preventOverflow',
      enabled: false,
      options: { altAxis: true, mainAxis: false, tether: true },
    },
    {
      name: 'flip',
      data: {
        x: true,
      },
    },
    {
      name: 'custom',
      enabled: true,
      phase: 'main',
    },
    {
      name: 'flip',
      options: {
        fallbackPlacements: ['right'],
      },
    },
    {
      name: 'custom',
      options: { x: true },
    },
    {
      name: 'custom',
      enabled: false,
    },
  ];

  expect(mergeByName(modifiers)).toMatchSnapshot();
});
