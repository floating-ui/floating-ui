import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  FloatingPortal,
  offset,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListItem,
  useListNavigation,
  useRole,
  useTypeahead,
} from '@floating-ui/react';
import {CheckIcon} from '@radix-ui/react-icons';
import c from 'clsx';
import * as React from 'react';

import {Button} from '../lib/Button';

function ColorSwatch({color}: {color?: string}) {
  return (
    <div
      aria-hidden
      className="rounded-full w-4 h-4 border border-slate-900/20 bg-clip-padding"
      style={{background: color?.toLowerCase()}}
    />
  );
}

interface SelectContextData {
  getItemProps: ReturnType<typeof useInteractions>['getItemProps'];
  activeIndex: number | null;
  selectedIndex: number | null;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  isTypingRef: React.MutableRefObject<boolean>;
  setSelectedValue: (value: string, index: number) => void;
  selectedValue: string;
}

const SelectContext = React.createContext<SelectContextData>({} as any);

function Select({
  children,
  value: controlledValue,
  onChange,
}: {
  children: React.ReactNode;
  value?: string;
  onChange?: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [uncontrolledValue, setUncontrolledValue] = React.useState('');

  const selectedValue = controlledValue ?? uncontrolledValue;
  const setSelectedValue = React.useCallback(
    (value: string, index: number) => {
      setSelectedIndex(index);
      setUncontrolledValue(value);
      onChange?.(value);
      setIsOpen(false);
    },
    [onChange],
  );

  const {refs, floatingStyles, context} = useFloating({
    placement: 'bottom-start',
    open: isOpen,
    onOpenChange: setIsOpen,
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

  const elementsRef = React.useRef<Array<HTMLElement | null>>([]);
  const labelsRef = React.useRef<Array<string | null>>([]);
  const isTypingRef = React.useRef(false);

  const click = useClick(context, {event: 'mousedown'});
  const dismiss = useDismiss(context);
  const role = useRole(context, {role: 'select'});
  const listNav = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    selectedIndex,
    onNavigate: setActiveIndex,
    // This is a large list, allow looping.
    loop: true,
  });
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    selectedIndex,
    onMatch: isOpen
      ? setActiveIndex
      : (index) => {
          setSelectedValue(labelsRef.current[index] || '', index);
        },
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
            aria-labelledby="select-label"
            data-open={isOpen ? '' : undefined}
            className="flex items-center gap-2 bg-slate-200 rounded w-[10rem]"
            {...getReferenceProps()}
          >
            {selectedValue && <ColorSwatch color={selectedValue} />}
            {selectedValue || 'Select...'}
          </Button>
        </div>
        <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
          <SelectContext.Provider
            value={{
              getItemProps,
              activeIndex,
              selectedIndex,
              setActiveIndex,
              setSelectedIndex,
              isTypingRef,
              selectedValue,
              setSelectedValue,
            }}
          >
            {isOpen ? (
              <FloatingPortal>
                <FloatingFocusManager context={context} modal={false}>
                  <div
                    ref={refs.setFloating}
                    style={floatingStyles}
                    className="bg-slate-200/50 max-h-[20rem] overflow-y-auto rounded outline-none p-1 backdrop-blur-sm"
                    {...getFloatingProps()}
                  >
                    {children}
                  </div>
                </FloatingFocusManager>
              </FloatingPortal>
            ) : (
              <div hidden>{children}</div>
            )}
          </SelectContext.Provider>
        </FloatingList>
      </div>
    </>
  );
}

const MemoOption = React.memo(
  React.forwardRef(function MemoOption(
    {
      children,
      active,
      selected,
      getItemProps,
      onSelect,
      isTypingRef,
    }: Pick<SelectContextData, 'getItemProps'> & {
      children: React.ReactNode;
      active: boolean;
      selected: boolean;
      onSelect: () => void;
      isTypingRef: React.MutableRefObject<boolean>;
    },
    ref: React.Ref<HTMLDivElement>,
  ) {
    return (
      <div
        ref={ref}
        className={c(
          'flex gap-2 items-center p-2 rounded outline-none cursor-default scroll-my-1',
          {
            'bg-cyan-200': active,
          },
        )}
        tabIndex={active ? 0 : -1}
        {...getItemProps({
          active,
          selected,
          // Handle pointer select.
          onClick: onSelect,
          // Handle keyboard select.
          onKeyDown(event) {
            if (event.key === 'Enter') {
              event.preventDefault();
              onSelect();
            }

            // Only if not using typeahead.
            if (event.key === ' ' && !isTypingRef.current) {
              event.preventDefault();
              onSelect();
            }
          },
        })}
      >
        <ColorSwatch color={String(children)?.toLowerCase()} />
        {children}
        <span aria-hidden className="absolute right-4">
          {selected ? <CheckIcon width={20} height={20} /> : ''}
        </span>
      </div>
    );
  }),
);

function Option({children, value}: {children: React.ReactNode; value: string}) {
  const {
    activeIndex,
    selectedIndex,
    setSelectedIndex,
    getItemProps,
    isTypingRef,
    selectedValue,
    setSelectedValue,
  } = React.useContext(SelectContext);

  const {ref, index} = useListItem({label: value});
  const isActive = index === activeIndex;
  const isSelected = index === selectedIndex;

  React.useLayoutEffect(() => {
    if (index !== selectedIndex && value === selectedValue) {
      setSelectedIndex(index);
    }
  }, [value, selectedValue, index, selectedIndex, setSelectedIndex]);

  const onSelect = React.useCallback(() => {
    setSelectedValue(value, index);
  }, [value, index, setSelectedValue]);

  return (
    <MemoOption
      ref={ref}
      active={isActive}
      selected={isSelected}
      getItemProps={getItemProps}
      onSelect={onSelect}
      isTypingRef={isTypingRef}
    >
      {children}
    </MemoOption>
  );
}

export function Main() {
  return (
    <Select>
      <Option value="Red">Red</Option>
      <Option value="Orange">Orange</Option>
      <Option value="Yellow">Yellow</Option>
      <Option value="Green">Green</Option>
      <Option value="Blue">Blue</Option>
    </Select>
  );
}
