import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {
  autoUpdate,
  Dimensions,
  ElementRects,
  size,
  useId,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from '..';

const data = [
  'Acai',
  'Apples',
  'Apricots',
  'Avocado',
  'Ackee',
  'Bananas',
  'Bilberries',
  'Blueberries',
  'Blackberries',
  'Boysenberries',
];

interface ItemProps {
  children: React.ReactNode;
  active: boolean;
}

const Item = forwardRef<HTMLLIElement, ItemProps>(({children, active}, ref) => {
  const id = useId();
  return (
    <li
      ref={ref}
      role="option"
      id={id}
      aria-selected={active}
      style={{
        background: active ? 'lightblue' : 'none',
      }}
    >
      {children}
    </li>
  );
});

export function AutoComplete() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [sizeData, setSizeData] = useState<Dimensions & ElementRects>();

  const listRef = useRef<Array<HTMLLIElement | null>>([]);

  const {x, y, reference, floating, strategy, context, refs, update} =
    useFloating({
      open,
      onOpenChange: setOpen,
      middleware: [size({apply: setSizeData})],
    });

  const {getReferenceProps, getFloatingProps} = useInteractions([
    useRole(context, {role: 'listbox'}),
    useDismiss(context),
    useListNavigation(context, {
      listRef,
      activeIndex,
      onNavigate: setActiveIndex,
      virtual: true,
    }),
  ]);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setInputValue(value);

    if (value) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }

  const items = data.filter((item) =>
    item.toLowerCase().startsWith(inputValue.toLowerCase())
  );

  useEffect(() => {
    if (open && refs.reference.current && refs.floating.current) {
      return autoUpdate(refs.reference.current, refs.floating.current, update);
    }
  }, [open, update, refs.reference, refs.floating]);

  return (
    <>
      <input
        {...getReferenceProps({
          ref: reference,
          onChange,
          value: inputValue,
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
      {open && (
        <div
          {...getFloatingProps({
            ref: floating,
            style: {
              position: strategy,
              left: x ?? '',
              top: y ?? '',
              background: 'white',
              color: 'black',
              width: sizeData?.reference.width ?? '',
            },
          })}
        >
          <ul>
            {items.map((item, index) => (
              <Item
                key={item}
                ref={(node) => {
                  listRef.current[index] = node;
                }}
                active={activeIndex === index}
              >
                {item}
              </Item>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
