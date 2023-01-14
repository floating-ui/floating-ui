import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
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
import * as React from 'react';

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

export function Main() {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const {x, y, strategy, refs, context} = useFloating({
    placement: 'bottom-start',
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({padding: 10}),
      size({
        apply({rects, elements, availableHeight}) {
          Object.assign(elements.floating.style, {
            maxHeight: `${availableHeight}px`,
            width: `${rects.reference.width}px`,
          });
        },
        padding: 10,
      }),
    ],
  });

  const listRef = React.useRef<Array<HTMLElement | null>>([]);
  const listContentRef = React.useRef(options);

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
    onMatch: open ? setActiveIndex : setSelectedIndex,
  });

  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    click,
    dismiss,
    role,
    listNav,
    typeahead,
  ]);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const selectedItemLabel =
    selectedIndex !== null ? options[selectedIndex] : undefined;

  return (
    <>
      <h1>Floating UI — Select</h1>
      <label
        onClick={(e) => {
          // Only presses directly on the button will open the menu.
          e.preventDefault();
        }}
      >
        <span>Select balloon color</span>
        <button
          ref={refs.setReference}
          style={{width: 150, lineHeight: 2}}
          aria-label={selectedItemLabel}
          aria-autocomplete="none"
          {...getReferenceProps()}
          // The default role for the reference using a "listbox"
          // is a "combobox", but Safari has a bug with VoiceOver
          // where it cuts off letters when announcing the button's
          // content when it has that role.
          // This overrides the one from the props above.
          role={undefined}
        >
          {selectedItemLabel || 'Select...'}
        </button>
      </label>
      <FloatingPortal>
        {open && (
          <FloatingFocusManager
            context={context}
            modal={false}
            initialFocus={-1}
          >
            <div
              ref={refs.setFloating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                overflowY: 'auto',
                background: '#eee',
                minWidth: 100,
                borderRadius: 8,
                outline: 0,
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
                  style={{
                    padding: 10,
                    cursor: 'default',
                    background: i === activeIndex ? 'cyan' : '',
                  }}
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
                      if (
                        event.key === ' ' &&
                        !context.dataRef.current.typing
                      ) {
                        event.preventDefault();
                        handleSelect(i);
                      }
                    },
                  })}
                >
                  {value}
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      right: 10,
                    }}
                  >
                    {i === selectedIndex ? ' ✓' : ''}
                  </span>
                </div>
              ))}
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </>
  );
}
