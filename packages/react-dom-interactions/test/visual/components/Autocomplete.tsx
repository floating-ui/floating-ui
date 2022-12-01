import React, {forwardRef, useLayoutEffect, useRef, useState} from 'react';
import {
  autoUpdate,
  size,
  useId,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from '@floating-ui/react-dom-interactions';
import {FloatingFocusManager, FloatingPortal} from '../../../src';

export const data = [
  'Alfalfa Sprouts',
  'Apple',
  'Apricot',
  'Artichoke',
  'Asian Pear',
  'Asparagus',
  'Atemoya',
  'Avocado',
  'Bamboo Shoots',
  'Banana',
  'Bean Sprouts',
  'Beans',
  'Beets',
  'Belgian Endive',
  'Bell Peppers',
  'Bitter Melon',
  'Blackberries',
  'Blueberries',
  'Bok Choy',
  'Boniato',
  'Boysenberries',
  'Broccoflower',
  'Broccoli',
  'Brussels Sprouts',
  'Cabbage',
  'Cactus Pear',
  'Cantaloupe',
  'Carambola',
  'Carrots',
  'Casaba Melon',
  'Cauliflower',
  'Celery',
  'Chayote',
  'Cherimoya',
  'Cherries',
  'Coconuts',
  'Collard Greens',
  'Corn',
  'Cranberries',
  'Cucumber',
  'Dates',
  'Dried Plums',
  'Eggplant',
  'Endive',
  'Escarole',
  'Feijoa',
  'Fennel',
  'Figs',
  'Garlic',
  'Gooseberries',
  'Grapefruit',
  'Grapes',
  'Green Beans',
  'Green Onions',
  'Greens',
  'Guava',
  'Hominy',
  'Honeydew Melon',
  'Horned Melon',
  'Iceberg Lettuce',
  'Jerusalem Artichoke',
  'Jicama',
  'Kale',
  'Kiwifruit',
  'Kohlrabi',
  'Kumquat',
  'Leeks',
  'Lemons',
  'Lettuce',
  'Lima Beans',
  'Limes',
  'Longan',
  'Loquat',
  'Lychee',
  'Madarins',
  'Malanga',
  'Mandarin Oranges',
  'Mangos',
  'Mulberries',
  'Mushrooms',
  'Napa',
  'Nectarines',
  'Okra',
  'Onion',
  'Oranges',
  'Papayas',
  'Parsnip',
  'Passion Fruit',
  'Peaches',
  'Pears',
  'Peas',
  'Peppers',
  'Persimmons',
  'Pineapple',
  'Plantains',
  'Plums',
  'Pomegranate',
  'Potatoes',
  'Prickly Pear',
  'Prunes',
  'Pummelo',
  'Pumpkin',
  'Quince',
  'Radicchio',
  'Radishes',
  'Raisins',
  'Raspberries',
  'Red Cabbage',
  'Rhubarb',
  'Romaine Lettuce',
  'Rutabaga',
  'Shallots',
  'Snow Peas',
  'Spinach',
  'Sprouts',
  'Squash',
  'Strawberries',
  'String Beans',
  'Sweet Potato',
  'Tangelo',
  'Tangerines',
  'Tomatillo',
  'Tomato',
  'Turnip',
  'Ugli Fruit',
  'Water Chestnuts',
  'Watercress',
  'Watermelon',
  'Waxed Beans',
  'Yams',
  'Yellow Squash',
  'Yuca/Cassava',
  'Zucchini Squash',
];

interface ItemProps {
  children: React.ReactNode;
  active: boolean;
}

const Item = forwardRef<
  HTMLDivElement,
  ItemProps & React.HTMLProps<HTMLDivElement>
>(({children, active, ...rest}, ref) => {
  const id = useId();
  return (
    <div
      ref={ref}
      role="option"
      id={id}
      aria-selected={active}
      {...rest}
      style={{
        background: active ? 'lightblue' : 'none',
        padding: 4,
        cursor: 'default',
        ...rest.style,
      }}
    >
      {children}
    </div>
  );
});

export function Main() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const listRef = useRef<Array<HTMLElement | null>>([]);

  const {x, y, reference, floating, strategy, context, refs} =
    useFloating<HTMLInputElement>({
      whileElementsMounted: autoUpdate,
      open,
      onOpenChange: setOpen,
      middleware: [
        size({
          apply({rects, availableHeight, elements}) {
            Object.assign(elements.floating.style, {
              width: `${rects.reference.width}px`,
              maxHeight: `${availableHeight}px`,
            });
          },
          padding: 10,
        }),
      ],
    });

  useLayoutEffect(() => {
    // IMPORTANT: When the floating element first opens, this effect runs when
    // the styles have **not yet** been applied to the element. A rAF ensures
    // we wait until the position is ready, and also runs before paint.
    // https://floating-ui.com/docs/react-dom#effects
    requestAnimationFrame(() => {
      if (activeIndex != null) {
        listRef.current[activeIndex]?.scrollIntoView({block: 'nearest'});
      }
    });
  }, [activeIndex]);

  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    useRole(context, {role: 'listbox'}),
    useDismiss(context),
    useListNavigation(context, {
      listRef,
      activeIndex,
      onNavigate: setActiveIndex,
      virtual: true,
      loop: true,
    }),
  ]);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setInputValue(value);

    if (value) {
      setOpen(true);
      // setActiveIndex(0);
    } else {
      setOpen(false);
    }
  }

  const items = data.filter((item) =>
    item.toLowerCase().startsWith(inputValue.toLowerCase())
  );

  return (
    <>
      <input
        {...getReferenceProps({
          ref: reference,
          onChange,
          value: inputValue,
          placeholder: 'Enter fruit',
          'aria-autocomplete': 'list',
          onKeyDown(event) {
            if (
              event.key === 'Enter' &&
              activeIndex != null &&
              items[activeIndex]
            ) {
              setInputValue(items[activeIndex]);
              setActiveIndex(null);
              setOpen(false);
            }
          },
        })}
      />
      <FloatingPortal>
        {open && (
          <FloatingFocusManager context={context} visuallyHiddenDismiss>
            <div
              {...getFloatingProps({
                ref: floating,
                style: {
                  position: strategy,
                  left: x ?? 0,
                  top: y ?? 0,
                  background: '#eee',
                  color: 'black',
                  overflowY: 'auto',
                },
              })}
            >
              {items.map((item, index) => (
                <Item
                  {...getItemProps({
                    key: item,
                    ref(node) {
                      listRef.current[index] = node;
                    },
                    onClick() {
                      setInputValue(item);
                      setOpen(false);
                      refs.reference.current?.focus();
                    },
                  })}
                  active={activeIndex === index}
                >
                  {item}
                </Item>
              ))}
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </>
  );
}
