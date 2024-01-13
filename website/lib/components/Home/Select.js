import {
  FloatingFocusManager,
  autoUpdate,
  flip,
  offset,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
} from '@floating-ui/react';
import classNames from 'classnames';
import {useRef, useState} from 'react';
import {Check} from 'react-feather';

import {Button} from '../Button';

const options = [
  'Red',
  'Orange',
  'Yellow',
  'Green',
  'Cyan',
  'Blue',
  'Purple',
  'Pink',
  'Maroon',
  'Black',
  'White',
];

function ColorSwatch({color}) {
  return (
    <div
      aria-hidden
      className="h-4 w-4 rounded-full border border-black/50 bg-clip-padding"
      style={{background: color}}
    />
  );
}

export function SelectDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const {x, y, strategy, refs, context} = useFloating({
    placement: 'bottom-start',
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      size({
        apply({rects, elements, availableHeight}) {
          Object.assign(elements.floating.style, {
            maxHeight: `${Math.max(200, availableHeight)}px`,
            width: `${rects.reference.width}px`,
          });
        },
        padding: 25,
      }),
      flip({
        padding: 25,
        fallbackStrategy: 'initialPlacement',
      }),
    ],
  });

  const listRef = useRef([]);
  const listContentRef = useRef(options);
  const isTypingRef = useRef(false);

  const click = useClick(context, {event: 'mousedown'});
  const dismiss = useDismiss(context);
  const role = useRole(context, {role: 'listbox'});
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    selectedIndex,
    onNavigate: setActiveIndex,
    // This is a large list, allow looping.
    loop: true,
  });
  const typeahead = useTypeahead(context, {
    listRef: listContentRef,
    activeIndex,
    selectedIndex,
    onMatch: isOpen ? setActiveIndex : setSelectedIndex,
    onTypingChange(isTyping) {
      isTypingRef.current = isTyping;
    },
  });

  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    click,
    dismiss,
    role,
    listNav,
    typeahead,
  ]);

  const handleSelect = (index) => {
    setSelectedIndex(index);
    setIsOpen(false);
  };

  const selectedItemLabel =
    selectedIndex !== null ? options[selectedIndex] : undefined;

  return (
    <div className="flex flex-col gap-2">
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <label
        className="text-md flex flex-col items-center font-bold"
        id="select-label"
        onClick={() => refs.domReference.current?.focus()}
      >
        Select balloon color
      </label>
      <Button
        // Safari VoiceOver cuts off the last letter of the textContent when a
        // native button has role="combobox" :|
        div
        ref={refs.setReference}
        aria-labelledby="select-label"
        aria-autocomplete="none"
        data-open={isOpen ? '' : undefined}
        className="flex w-[10rem] items-center gap-2 rounded bg-gray-100/75"
        {...getReferenceProps()}
      >
        <ColorSwatch color={selectedItemLabel?.toLocaleLowerCase()} />
        {selectedItemLabel || 'Select...'}
      </Button>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            ref={refs.setFloating}
            className="max-h-[20rem] overflow-y-auto rounded-lg border border-slate-900/5 bg-white/80 bg-clip-padding p-1 shadow-lg outline-none backdrop-blur-lg dark:bg-gray-600/80"
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
            }}
            {...getFloatingProps()}
          >
            {options.map((value, i) => (
              <div
                key={value}
                ref={(node) => {
                  listRef.current[i] = node;
                }}
                role="option"
                tabIndex={i === activeIndex ? 0 : -1}
                aria-selected={i === selectedIndex && i === activeIndex}
                className={classNames(
                  'flex cursor-default select-none scroll-my-1 items-center gap-2 rounded p-2 outline-none',
                  {
                    'bg-cyan-200 dark:bg-blue-500 dark:text-white':
                      i === activeIndex,
                  },
                )}
                {...getItemProps({
                  // Handle pointer select.
                  onClick() {
                    handleSelect(i);
                  },
                  // Handle keyboard select.
                  onKeyDown(event) {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleSelect(i);
                    }

                    // Only if not using typeahead.
                    if (event.key === ' ' && !isTypingRef.current) {
                      event.preventDefault();
                    }
                  },
                  onKeyUp(event) {
                    if (event.key === ' ' && !isTypingRef.current) {
                      handleSelect(i);
                    }
                  },
                })}
              >
                <ColorSwatch color={options[i]?.toLowerCase()} />
                {value}
                <span aria-hidden className="absolute right-4">
                  {i === selectedIndex && <Check width={20} height={20} />}
                </span>
              </div>
            ))}
          </div>
        </FloatingFocusManager>
      )}
    </div>
  );
}
