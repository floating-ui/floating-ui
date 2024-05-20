import {
  useFloating,
  useInteractions,
  useListNavigation,
  useTypeahead,
  useListItem,
  useRole,
  FloatingList,
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

function Listbox({children}: {children: React.ReactNode}) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(1);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const {refs, context} = useFloating({
    open: true,
  });

  const elementsRef = React.useRef<Array<HTMLElement | null>>([]);
  const labelsRef = React.useRef<Array<string | null>>([]);

  const handleSelect = React.useCallback((index: number | null) => {
    setSelectedIndex(index);
  }, []);

  function handleTypeaheadMatch(index: number | null) {
    setActiveIndex(index);
  }

  const listNav = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    selectedIndex,
    onNavigate: setActiveIndex,
    focusItemOnHover: false,
  });
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    selectedIndex,
    onMatch: handleTypeaheadMatch,
  });
  const role = useRole(context, {role: 'listbox'});

  const {getFloatingProps, getItemProps} = useInteractions([
    listNav,
    typeahead,
    role,
  ]);

  const selectContext = React.useMemo(
    () => ({
      activeIndex,
      selectedIndex,
      getItemProps,
      handleSelect,
    }),
    [activeIndex, selectedIndex, getItemProps, handleSelect],
  );

  return (
    <>
      <SelectContext.Provider value={selectContext}>
        <button onClick={() => setSelectedIndex(1)} data-testid="reference">
          Select
        </button>
        <div ref={refs.setFloating} {...getFloatingProps()}>
          <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
            {children}
          </FloatingList>
        </div>
      </SelectContext.Provider>
    </>
  );
}

function Option({label}: {label: string}) {
  const {activeIndex, selectedIndex, getItemProps, handleSelect} =
    React.useContext(SelectContext);

  const {ref, index} = useListItem({label});

  const isActive = activeIndex === index;
  const isSelected = selectedIndex === index;

  const isFocusable =
    activeIndex !== null
      ? isActive
      : selectedIndex !== null
        ? isSelected
        : index === 0;

  return (
    <button
      ref={ref}
      role="option"
      aria-selected={isActive && isSelected}
      tabIndex={isFocusable ? 0 : -1}
      style={{
        background: isActive ? 'cyan' : '',
        fontWeight: isSelected ? 'bold' : '',
      }}
      {...getItemProps({
        onClick: () => handleSelect(index),
      })}
    >
      {label}
    </button>
  );
}

export function Main() {
  return (
    <Listbox>
      <Option label="Apple" />
      <Option label="Blueberry" />
      <Option label="Watermelon" />
      <Option label="Banana" />
    </Listbox>
  );
}
