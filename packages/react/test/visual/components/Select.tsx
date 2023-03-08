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
import {CheckIcon} from '@radix-ui/react-icons';
import c from 'clsx';
import * as React from 'react';

import {Button} from '../lib/Button';

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

function ColorSwatch({color}: {color?: string}) {
  return (
    <div
      aria-hidden
      className="rounded-full w-4 h-4 border border-slate-900/20 bg-clip-padding"
      style={{background: color}}
    />
  );
}

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
  const isTypingRef = React.useRef(false);

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

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const selectedItemLabel =
    selectedIndex !== null ? options[selectedIndex] : undefined;

  return (
    <>
      <h1 className="text-5xl font-bold mb-8">Select</h1>
      <div className="grid place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
        <div>
          <label className="flex flex-col items-center" id="select-label">
            Select balloon color
          </label>
          <Button
            ref={refs.setReference}
            aria-labelledby={selectedItemLabel ? undefined : 'select-label'}
            aria-label={`${selectedItemLabel} - selected balloon color`}
            aria-autocomplete="none"
            data-open={open ? '' : undefined}
            className="flex items-center gap-2 bg-slate-200 rounded w-[10rem]"
            {...getReferenceProps()}
            // The default role for the reference using a "listbox"
            // is a "combobox", but Safari has a bug with VoiceOver
            // where it cuts off letters when announcing the button's
            // content when it has that role.
            // This overrides the one from the props above.
            role={undefined}
          >
            <ColorSwatch color={selectedItemLabel?.toLocaleLowerCase()} />
            {selectedItemLabel || 'Select...'}
          </Button>
        </div>
        <FloatingPortal>
          {open && (
            <FloatingFocusManager context={context} modal={false}>
              <div
                ref={refs.setFloating}
                className="bg-slate-200/50 max-h-[20rem] overflow-y-auto rounded outline-none p-1 backdrop-blur-sm"
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
                    className={c(
                      'flex gap-2 items-center p-2 rounded outline-none cursor-default scroll-my-1',
                      {
                        'bg-cyan-200': i === activeIndex,
                      }
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
                          handleSelect(i);
                        }
                      },
                    })}
                  >
                    <ColorSwatch color={options[i]?.toLowerCase()} />
                    {value}
                    <span aria-hidden className="absolute right-4">
                      {i === selectedIndex ? (
                        <CheckIcon width={20} height={20} />
                      ) : (
                        ''
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </FloatingFocusManager>
          )}
        </FloatingPortal>
      </div>
    </>
  );
}
