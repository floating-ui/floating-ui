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
  Placement,
} from '@floating-ui/react-dom-interactions';

import './EmojiPicker.css';

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
      style={{
        background: active
          ? 'rgba(0, 255, 255, 0.5)'
          : selected
          ? 'rgba(0, 10, 20, 0.1)'
          : 'none',
        border: active
          ? '1px solid rgba(0, 225, 255, 1)'
          : '1px solid transparent',
        borderRadius: 4,
        fontSize: 30,
        textAlign: 'center',
        cursor: 'default',
        userSelect: 'none',
        padding: 0,
      }}
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

  const listRef = useRef<Array<HTMLElement | null>>([]);

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
    placement: placement ?? 'bottom',
    open,
    onOpenChange: setOpen,
    // We don't want flipping to occur while searching, as the floating element
    // will resize and cause disorientation.
    middleware: [offset(4), ...(placement ? [] : [flip()])],
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
    name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  );

  return (
    <>
      <h1>Emoji Picker</h1>
      <div className="container">
        <div style={{textAlign: 'center'}}>
          <button
            ref={reference}
            className="EmojiPicker-button"
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
              <FloatingFocusManager context={context}>
                <div
                  ref={floating}
                  className="EmojiPicker"
                  style={{
                    position: strategy,
                    left: x ?? 0,
                    top: y ?? 0,
                  }}
                  {...getFloatingProps(getListFloatingProps())}
                >
                  <span
                    style={{
                      opacity: 0.4,
                      fontSize: 12,
                      textTransform: 'uppercase',
                    }}
                  >
                    Emoji Picker
                  </span>
                  <input
                    className="EmojiPicker-search"
                    placeholder="Search emoji"
                    value={search}
                    aria-controls={noResultsId}
                    {...getInputProps({
                      onChange: handleInputChange,
                      onKeyDown: handleKeyDown,
                    })}
                  />
                  <button
                    className="EmojiPicker-close"
                    aria-label="Close picker"
                    onClick={() => setOpen(false)}
                  >
                    ×
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
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '40px 40px 40px',
                      }}
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
        </div>
      </div>
    </>
  );
};
