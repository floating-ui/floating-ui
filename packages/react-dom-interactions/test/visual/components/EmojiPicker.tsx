import {useState, useRef, useEffect} from 'react';
import {
  useFloating,
  useInteractions,
  useListNavigation,
  useClick,
  useDismiss,
  FloatingFocusManager,
  useRole,
  offset,
  flip,
  autoUpdate,
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

export const Main = () => {
  const [emoji, setEmoji] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const listRef = useRef<Array<HTMLElement | null>>([]);

  const {x, y, reference, floating, strategy, context} = useFloating({
    placement: 'bottom-start',
    open: showPicker,
    onOpenChange: setShowPicker,
    middleware: [offset(8), flip()],
    whileElementsMounted: autoUpdate,
  });

  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    useClick(context),
    useDismiss(context),
    useRole(context, {role: 'menu'}),
    useListNavigation(context, {
      listRef,
      onNavigate: showPicker ? setActiveIndex : undefined,
      activeIndex,
      cols: 3,
      orientation: 'horizontal',
      loop: true,
      openOnArrowKeyDown: false,
      focusItemOnOpen: false,
      virtual: true,
      allowEscape: true,
    }),
  ]);

  useEffect(() => {
    if (!showPicker) {
      setSearch('');
      setActiveIndex(null);
    }
  }, [showPicker]);

  const handleEmojiClick = () => {
    if (activeIndex !== null) {
      setEmoji(filteredEmojis[activeIndex].emoji);
      setShowPicker(false);
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
          {emoji && (
            <span id="emoji-label">
              <span style={{fontSize: 36}}>{emoji}</span> is the selected emoji
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
          {showPicker && (
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
                {...getFloatingProps()}
              >
                <input
                  placeholder="Search emoji"
                  value={search}
                  onChange={handleInputChange}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleEmojiClick();
                    }
                  }}
                  aria-activedescendant={
                    activeIndex == null ? undefined : `option-${activeIndex}`
                  }
                />
                <button
                  aria-label="Close picker"
                  onClick={() => setShowPicker(false)}
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
                  {filteredEmojis.map(({name, emoji: e}, index) => (
                    <button
                      role="option"
                      id={`option-${index}`}
                      key={name}
                      aria-selected={emoji === e}
                      aria-label={name}
                      tabIndex={-1}
                      ref={(node) => {
                        listRef.current[index] = node;
                      }}
                      style={{
                        background: activeIndex === index ? 'cyan' : 'none',
                        borderRadius: 4,
                        border: 'none',
                        fontSize: 36,
                      }}
                      {...getItemProps({
                        onClick: handleEmojiClick,
                      })}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </FloatingFocusManager>
          )}
        </div>
      </div>
    </>
  );
};
