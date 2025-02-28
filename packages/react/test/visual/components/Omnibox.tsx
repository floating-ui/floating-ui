import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  offset,
  size,
  useDismiss,
  useFloating,
  useFocus,
  useInteractions,
  useListItem,
  useListNavigation,
  useRole,
} from '@floating-ui/react';
import {Cross1Icon} from '@radix-ui/react-icons';
import cn from 'clsx';
import {createContext, useContext, useId, useRef, useState} from 'react';

interface SelectContextValue {
  activeIndex: number | null;
  getItemProps: ReturnType<typeof useInteractions>['getItemProps'];
}

const SelectContext = createContext<SelectContextValue>(
  {} as SelectContextValue,
);

function SearchOption({
  value,
  onClick,
  onRemove,
}: {
  value: string;
  onClick: () => void;
  onRemove: () => void;
}) {
  const {ref, index} = useListItem();
  const {activeIndex, getItemProps} = useContext(SelectContext);
  const isActive = index === activeIndex;
  const id = useId();

  return (
    <div
      id={id}
      ref={ref}
      tabIndex={0}
      role="option"
      aria-selected={isActive}
      className={cn(
        'p-4 outline-none cursor-default flex justify-between align-items-center',
        {
          'bg-slate-50': isActive,
        },
      )}
      {...getItemProps({
        onClick,
        onKeyDown(e) {
          if (e.currentTarget !== e.target) return;

          if (e.key === 'Backspace') {
            onRemove();
          } else if (e.key === ' ' || e.key === 'Enter') {
            onClick();
          }
        },
      })}
    >
      {value}
      <button
        className="flex justify-center items-center text-blue-600 w-8 h-8 text-xl hover:bg-sky-100 transition-colors rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        aria-label="Remove"
      >
        <Cross1Icon />
      </button>
    </div>
  );
}

export function Main() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isFocusEnabled, setIsFocusEnabled] = useState(true);

  const [options, setOptions] = useState([
    'bun 1.0',
    'floating-ui',
    'ariakit',
    'react',
  ]);

  const removedIndexRef = useRef<number | null>(null);

  const {refs, floatingStyles, context} = useFloating<HTMLInputElement>({
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(2),
      flip({padding: 15}),
      size({
        apply({availableHeight, elements, rects}) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
        padding: 15,
      }),
    ],
  });

  const elementsRef = useRef<Array<HTMLElement | null>>([]);

  const hasOptions = options.length > 0;

  const focus = useFocus(context, {enabled: hasOptions && isFocusEnabled});
  const dismiss = useDismiss(context);
  const role = useRole(context, {enabled: hasOptions, role: 'listbox'});
  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    allowEscape: true,
    loop: true,
  });

  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    focus,
    dismiss,
    role,
    listNavigation,
  ]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const value = e.currentTarget.value.trim();

    if (e.key !== 'Enter' && !e.key.startsWith('Arrow')) {
      setActiveIndex(null);
      return;
    }

    if (e.key === 'Enter' && value && !options.includes(value)) {
      setOptions((options) => [value, ...options]);
    }

    if (e.key === 'Enter' && activeIndex !== null) {
      e.currentTarget.value = options[activeIndex];
      setIsOpen(false);
    }
  }

  return (
    <>
      <h1 className="text-5xl font-bold mb-8">Omnibox</h1>
      <div className="grid place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
        <input
          ref={refs.setReference}
          className="rounded-full sm:w-48 md:w-96 bg-gray-100 px-4 py-2 border border-transparent focus:bg-white focus focus:border-blue-500 outline-none"
          placeholder="Search"
          {...getReferenceProps({
            onKeyDown: handleKeyDown,
            onBlur() {
              setIsFocusEnabled(true);
            },
          })}
        />
        {isOpen && (
          <FloatingFocusManager
            context={context}
            initialFocus={-1}
            restoreFocus
            modal={false}
          >
            <div
              className="bg-white bg-clip-padding rounded-lg shadow-md border border-slate-900/10 text-left overflow-y-auto"
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
            >
              <div className="flex justify-between align-items-center p-4">
                <h3 className="font-bold text-xl">Recent</h3>
                {hasOptions && (
                  <button
                    className="text-blue-500 font-bold px-2 py-1 rounded-lg hover:bg-sky-50"
                    onClick={() => {
                      setOptions([]);
                      setIsOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key !== 'Escape') {
                        e.stopPropagation();
                      }
                    }}
                  >
                    Clear all
                  </button>
                )}
              </div>
              {!hasOptions && <p className="px-4 pb-4">No recent searches.</p>}
              <FloatingList elementsRef={elementsRef}>
                <SelectContext.Provider value={{activeIndex, getItemProps}}>
                  {options.map((option, index) => (
                    <SearchOption
                      key={option}
                      value={option}
                      onRemove={() => {
                        removedIndexRef.current = index;
                        setOptions((options) =>
                          options.filter((o) => o !== option),
                        );
                      }}
                      onClick={() => {
                        if (
                          activeIndex === null ||
                          !refs.domReference.current
                        ) {
                          return;
                        }

                        setIsOpen(false);
                        setIsFocusEnabled(false);
                        refs.domReference.current.value = options[activeIndex];
                      }}
                    />
                  ))}
                </SelectContext.Provider>
              </FloatingList>
            </div>
          </FloatingFocusManager>
        )}
      </div>
    </>
  );
}
