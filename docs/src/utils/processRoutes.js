const BLACKLIST = new Set(['/404/']);
const DIR_ORDER = [
  'tippy',
  'constructors',
  'modifiers',
  'utils',
  'virtual-elements',
  'tree-shaking',
  'faq',
  'typings',
  'browser-support',
];
const MODIFIER_ORDER = [
  'Popper Offsets',
  'Offset',
  'Prevent Overflow',
  'Arrow',
  'Flip',
  'Hide',
  'Compute Styles',
  'Apply Styles',
  'Event Listeners',
];

// I think this takes 0.5ms - 1ms on my MBP, we need to optimize this...
export default function processRoutes(routes) {
  const preprocessedRoutes = routes
    .filter(route => !BLACKLIST.has(route.slug))
    .map(route => {
      // Cloning is expensive, make sure mutating here isn't a problem
      // Removes the trailing slash
      route.slug = route.slug.replace(/\/$/, '');
      return route;
    })
    .sort((a, b) => a.slug.split('/').length - b.slug.split('/').length)
    .sort(
      (a, b) =>
        MODIFIER_ORDER.indexOf(a.title) - MODIFIER_ORDER.indexOf(b.title)
    );

  return [
    ...preprocessedRoutes.filter(
      route => !DIR_ORDER.some(type => route.slug.includes(type))
    ),
    ...DIR_ORDER.reduce(
      (acc, type) => [
        ...acc,
        ...preprocessedRoutes.filter(route => route.slug.includes(type)),
      ],
      []
    ),
  ];
}
