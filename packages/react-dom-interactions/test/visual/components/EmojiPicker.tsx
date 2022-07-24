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

type OptionProps = React.HTMLProps<HTMLButtonElement> & {
  name: string;
  active: boolean;
  selected: boolean;
  onClick: () => void;
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
      type="button"
      ref={ref}
      role="option"
      id={id}
      key={name}
      aria-selected={selected}
      aria-label={name}
      tabIndex={-1}
      style={{
        background: active ? 'cyan' : 'none',
        borderRadius: 4,
        border: 'none',
        fontSize: 36,
        textAlign: 'center',
        cursor: 'default',
        userSelect: 'none',
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

  const listRef = useRef<Array<HTMLElement | null>>([]);

  const {x, y, reference, floating, strategy, context} = useFloating({
    placement: 'bottom-start',
    open,
    onOpenChange: setOpen,
    middleware: [offset(8), flip()],
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
    if (!open) {
      setSearch('');
      setActiveIndex(null);
    }
  }, [open]);

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
        <div>
          {selectedEmoji && (
            <span id="emoji-label">
              <span
                style={{fontSize: 36}}
                aria-label={
                  emojis.find(({emoji}) => emoji === selectedEmoji)?.name
                }
              >
                {selectedEmoji}
              </span>{' '}
              is the selected emoji
            </span>
          )}
          <br />
          <button
            ref={reference}
            aria-describedby="emoji-label"
            {...getReferenceProps()}
          >
            Choose emoji
          </button>
          <FloatingPortal>
            {open && (
              <FloatingFocusManager context={context}>
                <div
                  ref={floating}
                  style={{
                    position: strategy,
                    left: x ?? 0,
                    top: y ?? 0,
                    padding: 15,
                    border: '1px solid black',
                    background: 'white',
                  }}
                  {...getFloatingProps(getListFloatingProps())}
                >
                  <input
                    placeholder="Search emoji"
                    value={search}
                    {...getInputProps({
                      onChange: handleInputChange,
                      onKeyDown: handleKeyDown,
                    })}
                  />
                  <button
                    aria-label="Close picker"
                    onClick={() => setOpen(false)}
                  >
                    X
                  </button>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '50px 50px 50px',
                    }}
                    role="listbox"
                  >
                    {filteredEmojis.map(({name, emoji}, index) => (
                      <Option
                        key={name}
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
                </div>
              </FloatingFocusManager>
            )}
          </FloatingPortal>
        </div>
      </div>
    </>
  );
};
