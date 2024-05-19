import type {Placement} from '@floating-ui/react';
import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useListNavigation,
  useRole,
} from '@floating-ui/react';
import c from 'clsx';
import {forwardRef, useEffect, useRef, useState} from 'react';

import {Button} from '../lib/Button';

const emojis = [
  {
    name: 'apple',
    emoji: '🍎',
  },
  {
    name: 'orange',
    emoji: '🍊',
  },
  {
    name: 'watermelon',
    emoji: '🍉',
  },
  {
    name: 'strawberry',
    emoji: '🍓',
  },
  {
    name: 'pear',
    emoji: '🍐',
  },
  {
    name: 'banana',
    emoji: '🍌',
  },
  {
    name: 'pineapple',
    emoji: '🍍',
  },
  {
    name: 'cherry',
    emoji: '🍒',
  },
  {
    name: 'peach',
    emoji: '🍑',
  },
];

type OptionProps = React.HTMLAttributes<HTMLButtonElement> & {
  name: string;
  active: boolean;
  selected: boolean;
  children: React.ReactNode;
};

const Option = forwardRef<HTMLButtonElement, OptionProps>(function Option(
  {name, active, selected, children, ...props},
  ref,
) {
  const id = useId();
  return (
    <button
      {...props}
      ref={ref}
      id={id}
      role="option"
      className={c(
        'rounded text-3xl text-center cursor-default select-none aspect-square',
        {
          'bg-cyan-100': selected && !active,
          'bg-cyan-200': active,
          'opacity-40': name === 'orange',
        },
      )}
      aria-selected={selected}
      disabled={name === 'orange'}
      aria-label={name}
      tabIndex={-1}
      data-active={active ? '' : undefined}
    >
      {children}
    </button>
  );
});

export const Main = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [placement, setPlacement] = useState<Placement | null>(null);

  const arrowRef = useRef(null);

  const listRef = useRef<Array<HTMLElement | null>>([]);

  const noResultsId = useId();

  const {
    floatingStyles,
    refs,
    context,
    placement: resultantPlacement,
  } = useFloating({
    placement: placement ?? 'bottom-start',
    open,
    onOpenChange: setOpen,
    // We don't want flipping to occur while searching, as the floating element
    // will resize and cause disorientation.
    middleware: [
      offset(8),
      ...(placement ? [] : [flip()]),
      arrow({
        element: arrowRef,
        padding: 20,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  // Handles opening the floating element via the Choose Emoji button.
  const {getReferenceProps, getFloatingProps} = useInteractions([
    useClick(context),
    useDismiss(context),
    useRole(context, {role: 'menu'}),
  ]);

  // Handles the list navigation where the reference is the inner input, not
  // the button that opens the floating element.
  const {
    getReferenceProps: getInputProps,
    getFloatingProps: getListFloatingProps,
    getItemProps,
  } = useInteractions([
    useListNavigation(context, {
      listRef,
      onNavigate: open ? setActiveIndex : undefined,
      activeIndex,
      cols: 3,
      orientation: 'horizontal',
      loop: true,
      focusItemOnOpen: false,
      virtual: true,
      allowEscape: true,
    }),
  ]);

  useEffect(() => {
    if (open) {
      setPlacement(resultantPlacement);
    } else {
      setSearch('');
      setActiveIndex(null);
      setPlacement(null);
    }
  }, [open, resultantPlacement]);

  const handleEmojiClick = () => {
    if (activeIndex !== null) {
      setSelectedEmoji(filteredEmojis[activeIndex].emoji);
      setOpen(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleEmojiClick();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActiveIndex(null);
    setSearch(event.target.value);
  };

  const filteredEmojis = emojis.filter(({name}) =>
    name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  );

  return (
    <>
      <h1 className="text-5xl font-bold mb-8">Emoji Picker</h1>
      <div className="grid place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
        <div className="text-center">
          <Button
            ref={refs.setReference}
            className="text-2xl"
            aria-label="Choose emoji"
            aria-describedby="emoji-label"
            data-open={open ? '' : undefined}
            {...getReferenceProps()}
          >
            ☻
          </Button>
          <br />
          {selectedEmoji && (
            <span id="emoji-label">
              <span
                style={{fontSize: 30}}
                aria-label={
                  emojis.find(({emoji}) => emoji === selectedEmoji)?.name
                }
              >
                {selectedEmoji}
              </span>{' '}
              selected
            </span>
          )}
          <FloatingPortal>
            {open && (
              <FloatingFocusManager context={context} modal={false}>
                <div
                  ref={refs.setFloating}
                  className="bg-white/70 backdrop-blur-sm border border-slate-900/10 shadow-md rounded-lg p-4 bg-clip-padding"
                  style={floatingStyles}
                  {...getFloatingProps(getListFloatingProps())}
                >
                  <FloatingArrow
                    ref={arrowRef}
                    context={context}
                    fill="white"
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth={1}
                    height={8}
                    tipRadius={1}
                  />
                  <span className="opacity-40 text-sm uppercase">
                    Emoji Picker
                  </span>
                  <input
                    className="block w-36 my-2 p-1 border border-slate-300 outline-none focus:border-blue-600 rounded"
                    placeholder="Search emoji"
                    value={search}
                    aria-controls={
                      filteredEmojis.length === 0 ? noResultsId : undefined
                    }
                    {...getInputProps({
                      onChange: handleInputChange,
                      onKeyDown: handleKeyDown,
                    })}
                  />
                  {filteredEmojis.length === 0 && (
                    <p
                      key={search}
                      id={noResultsId}
                      role="region"
                      aria-atomic="true"
                      aria-live="assertive"
                    >
                      No results.
                    </p>
                  )}
                  {filteredEmojis.length > 0 && (
                    <div className="grid grid-cols-3" role="listbox">
                      {filteredEmojis.map(({name, emoji}, index) => (
                        <Option
                          key={name}
                          name={name}
                          ref={(node) => {
                            listRef.current[index] = node;
                          }}
                          selected={selectedEmoji === emoji}
                          active={activeIndex === index}
                          {...getItemProps({
                            onClick: handleEmojiClick,
                          })}
                        >
                          {emoji}
                        </Option>
                      ))}
                    </div>
                  )}
                </div>
              </FloatingFocusManager>
            )}
          </FloatingPortal>
        </div>
      </div>
    </>
  );
};
