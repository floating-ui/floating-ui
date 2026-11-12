import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListItem,
  useListNavigation,
  useRole,
  useTypeahead,
} from '@floating-ui/react';
import * as React from 'react';

interface SelectContextValue {
  activeIndex: number | null;
  selectedIndex: number | null;
  getItemProps: ReturnType<typeof useInteractions>['getItemProps'];
  handleSelect: (index: number | null) => void;
}

const SelectContext = React.createContext<SelectContextValue>(
  {} as SelectContextValue,
);

function Select({children}: {children: React.ReactNode}) {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [selectedLabel, setSelectedLabel] = React.useState<string | null>(null);
  const {refs, context, floatingStyles} = useFloating({
    placement: 'bottom-start',
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [flip()],
  });
  const listRef = React.useRef<Array<HTMLElement | null>>([]);
  const labelsRef = React.useRef<Array<string | null>>([]);
  const handleSelect = React.useCallback((index: number | null) => {
    setSelectedIndex(index);
    setOpen(false);
    if (index !== null) {
      setSelectedLabel(labelsRef.current[index]);
    }
  }, []);
  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    selectedIndex,
    onNavigate: setActiveIndex,
    virtual: true,
  });
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    selectedIndex,
    onMatch: open ? setActiveIndex : handleSelect,
  });
  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    listNavigation,
    typeahead,
    useClick(context),
    useDismiss(context),
    useRole(context, {role: 'listbox'}),
  ]);

  return (
    <>
      <div ref={refs.setReference} tabIndex={0} {...getReferenceProps()}>
        {selectedLabel ?? 'Select...'}
      </div>
      <SelectContext.Provider
        value={React.useMemo(
          () => ({activeIndex, selectedIndex, getItemProps, handleSelect}),
          [activeIndex, selectedIndex, getItemProps, handleSelect],
        )}
      >
        {open && (
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
            >
              <FloatingList elementsRef={listRef} labelsRef={labelsRef}>
                {children}
              </FloatingList>
            </div>
          </FloatingFocusManager>
        )}
      </SelectContext.Provider>
    </>
  );
}

function Option({label}: {label: string}) {
  const {activeIndex, selectedIndex, getItemProps, handleSelect} =
    React.useContext(SelectContext);
  const id = React.useId();
  const {ref, index} = useListItem({label});
  const active = activeIndex === index;
  const selected = selectedIndex === index;

  return (
    <button
      id={id}
      ref={ref}
      role="option"
      aria-selected={active && selected}
      tabIndex={active ? 0 : -1}
      style={{
        background: active ? 'cyan' : '',
        fontWeight: selected ? 'bold' : '',
      }}
      {...getItemProps({onClick: () => handleSelect(index)})}
    >
      {label}
    </button>
  );
}

export function Main() {
  return (
    <>
      <h1>Virtual select with composable children</h1>
      <Select>
        <Option label="Apple" />
        <Option label="Blueberry" />
        <Option label="Watermelon" />
        <Option label="Banana" />
      </Select>
    </>
  );
}
