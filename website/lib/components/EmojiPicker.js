import {useState, useRef, useEffect, forwardRef} from 'react';
import {
  useFloating,
  useInteractions,
  useListNavigation,
  useClick,
  useDismiss,
  FloatingFocusManager,
  FloatingPortal,
  useRole,
  offset,
  flip,
  autoUpdate,
  useId,
} from '@floating-ui/react-dom-interactions';

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

const Option = forwardRef(function Option(
  {name, active, selected, children, ...props},
  ref
) {
  const id = useId();
  return (
    <button
      {...props}
      ref={ref}
      id={id}
      role="option"
      aria-selected={selected}
      aria-label={name}
      tabIndex={-1}
      className="text-4xl p-0 rounded text-center cursor-default user-select-none"
      style={{
        background: active
          ? 'rgba(0, 255, 255, 0.3)'
          : selected
          ? 'rgba(0, 10, 20, 0.1)'
          : 'none',
        border: active
          ? '1px solid rgba(0, 225, 255, 0.8)'
          : '1px solid transparent',
      }}
    >
      {children}
    </button>
  );
});

export function EmojiPicker() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [placement, setPlacement] = useState(null);

  const listRef = useRef([]);
  const noResultsId = useId();

  const {
    x,
    y,
    reference,
    floating,
    strategy,
    context,
    placement: resultantPlacement,
  } = useFloating({
    placement: placement ?? 'top',
    open,
    onOpenChange: setOpen,
    // We don't want flipping to occur while searching, as the floating element
    // will resize and cause disorientation.
    middleware: [
      offset(4),
      ...(placement
        ? []
        : [
            flip({
              fallbackPlacements: ['top-start', 'bottom-start'],
            }),
          ]),
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

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleEmojiClick();
    }
  };

  const handleInputChange = (event) => {
    setActiveIndex(null);
    setSearch(event.target.value);
  };

  const filteredEmojis = emojis.filter(({name}) =>
    name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  );

  return (
    <>
      <button
        ref={reference}
        className="text-5xl"
        aria-label="Choose emoji"
        aria-describedby="emoji-label"
        style={{
          background: open ? 'rgba(0, 10, 20, 0.1)' : '',
        }}
        {...getReferenceProps()}
      >
        ☻
      </button>
      <br />
      {selectedEmoji && (
        <span id="emoji-label">
          <span
            className="text-4xl"
            aria-label={
              emojis.find(({emoji}) => emoji === selectedEmoji)
                ?.name
            }
          >
            {selectedEmoji}
          </span>{' '}
          selected
        </span>
      )}
      <FloatingPortal>
        {open && (
          <FloatingFocusManager context={context}>
            <div
              ref={floating}
              className="bg-gray-700 text-gray-50 shadow-lg p-4 rounded-lg"
              style={{
                position: strategy,
                left: x ?? 0,
                top: y ?? 0,
                border: '1px solid rgba(200, 200, 255, 0.2)',
              }}
              {...getFloatingProps(getListFloatingProps())}
            >
              <div role="combobox">
                <input
                  className="bg-gray-1000 py-1 px-2 rounded outline-0 focus:ring-2 w-[9rem] mb-2"
                  placeholder="Search emoji"
                  value={search}
                  aria-controls={noResultsId}
                  {...getInputProps({
                    onChange: handleInputChange,
                    onKeyDown: handleKeyDown,
                  })}
                />
              </div>
              <button
                className="sr-only"
                tabIndex={-1}
                onClick={() => setOpen(false)}
              >
                Close
              </button>
              {filteredEmojis.length === 0 && (
                <p
                  key={search}
                  id={noResultsId}
                  className="EmojiPicker-no-results"
                  role="region"
                  aria-atomic="true"
                  aria-live="assertive"
                >
                  No results.
                </p>
              )}
              {filteredEmojis.length > 0 && (
                <div
                  className="grid"
                  style={{gridTemplateColumns: '3rem 3rem 3rem'}}
                  role="listbox"
                >
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
    </>
  );
}
