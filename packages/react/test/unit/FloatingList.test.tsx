import {act, fireEvent, render, screen} from '@testing-library/react';
import * as React from 'react';

import {
  FloatingList,
  useClick,
  useFloating,
  useInteractions,
  useListItem,
  useListNavigation,
  useTypeahead,
} from '../../src';

const SelectContext = React.createContext<any>(null);

function Select({children}: {children: React.ReactNode}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const {refs, context} = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  const elementsRef = React.useRef<Array<HTMLElement | null>>([]);
  const labelsRef = React.useRef<Array<string | null>>([]);

  const click = useClick(context);
  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    onNavigate: setActiveIndex,
  });
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    onMatch: setActiveIndex,
  });

  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    click,
    listNavigation,
    typeahead,
  ]);

  return (
    <SelectContext.Provider value={{getItemProps, activeIndex}}>
      <button ref={refs.setReference} {...getReferenceProps()}>
        Open select menu
      </button>
      <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
        {isOpen && (
          <div ref={refs.setFloating} role="listbox" {...getFloatingProps()}>
            {children}
          </div>
        )}
      </FloatingList>
    </SelectContext.Provider>
  );
}

function Option({
  children,
  label,
}: {
  children: React.ReactNode;
  label?: string;
}) {
  const {getItemProps, activeIndex} = React.useContext(SelectContext);
  const {ref, index} = useListItem({label});
  const isActive = index === activeIndex && index !== null;
  return (
    <div
      ref={ref}
      role="option"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      {...getItemProps()}
    >
      {children}
    </div>
  );
}

test('registers element ref and indexes correctly', async () => {
  render(
    <Select>
      <Option>One</Option>
      <div>
        <Option>Two</Option>
        <Option>Three</Option>
        <Option>Four</Option>
      </div>
      <>
        <Option>Five</Option>
        <Option>Six</Option>
      </>
    </Select>,
  );

  fireEvent.click(screen.getByRole('button'));
  await act(async () => {});

  expect(screen.getAllByRole('option')[0]).toHaveFocus();

  fireEvent.keyDown(screen.getByRole('listbox'), {key: 'ArrowDown'});

  expect(screen.getAllByRole('option')[1]).toHaveFocus();

  fireEvent.keyDown(screen.getByRole('listbox'), {key: 'ArrowDown'});

  expect(screen.getAllByRole('option')[2]).toHaveFocus();

  fireEvent.keyDown(screen.getByRole('listbox'), {key: 'ArrowDown'});
  fireEvent.keyDown(screen.getByRole('listbox'), {key: 'ArrowDown'});

  expect(screen.getAllByRole('option')[4]).toHaveFocus();
  expect(screen.getAllByRole('option')[4].getAttribute('tabindex')).toBe('0');
});

test('registers an element ref and index correctly', async () => {
  render(
    <Select>
      <Option>One</Option>
    </Select>,
  );

  fireEvent.click(screen.getByRole('button'));
  await act(async () => {});

  expect(screen.getAllByRole('option')[0]).toHaveFocus();
});

test('registers strings correctly (no value)', async () => {
  render(
    <Select>
      <Option>One</Option>
      <div>
        <Option>Two</Option>
        <Option>Three</Option>
        <Option>Four</Option>
      </div>
      <>
        <Option>Five</Option>
        <Option>Six</Option>
      </>
    </Select>,
  );

  fireEvent.click(screen.getByRole('button'));
  await act(async () => {});

  expect(screen.getAllByRole('option')[0]).toHaveFocus();

  fireEvent.keyDown(screen.getByRole('listbox'), {key: 'F'});

  expect(screen.getAllByRole('option')[3]).toHaveFocus();

  fireEvent.keyDown(screen.getByRole('listbox'), {key: 'I'});

  expect(screen.getAllByRole('option')[4]).toHaveFocus();
});

test('registers strings correctly (label)', async () => {
  render(
    <Select>
      <Option label="One">One</Option>
      <div>
        <Option label="Two">Two</Option>
        <Option label="Three">Three</Option>
        <Option label="Four">Four</Option>
      </div>
      <>
        <Option label="Five">Five</Option>
        <Option label="Six">Six</Option>
      </>
    </Select>,
  );

  fireEvent.click(screen.getByRole('button'));
  await act(async () => {});

  expect(screen.getAllByRole('option')[0]).toHaveFocus();

  fireEvent.keyDown(screen.getByRole('listbox'), {key: 'F'});

  expect(screen.getAllByRole('option')[3]).toHaveFocus();

  fireEvent.keyDown(screen.getByRole('listbox'), {key: 'I'});

  expect(screen.getAllByRole('option')[4]).toHaveFocus();
});

test('handles re-ordering', async () => {
  const {rerender} = render(
    <Select>
      <Option>One</Option>
      <div>
        <Option>Two</Option>
        <Option>Three</Option>
        <Option>Four</Option>
      </div>
      <>
        <Option>Five</Option>
        <Option>Six</Option>
      </>
    </Select>,
  );

  fireEvent.click(screen.getByRole('button'));
  await act(async () => {});

  expect(screen.getAllByRole('option')[0]).toHaveFocus();

  fireEvent.keyDown(screen.getByRole('listbox'), {key: 'ArrowDown'});

  expect(screen.getAllByRole('option')[1]).toHaveFocus();

  rerender(
    <Select>
      <Option>One</Option>
      <div>
        <Option>Two</Option>
        <Option>Three</Option>
        <Option>Four</Option>
      </div>
      <>
        <Option>Six</Option>
        <Option>Five</Option>
      </>
    </Select>,
  );

  fireEvent.keyDown(screen.getByRole('listbox'), {key: 'ArrowDown'});
  fireEvent.keyDown(screen.getByRole('listbox'), {key: 'ArrowDown'});
  fireEvent.keyDown(screen.getByRole('listbox'), {key: 'ArrowDown'});
  fireEvent.keyDown(screen.getByRole('listbox'), {key: 'ArrowDown'});

  expect(screen.getAllByRole('option')[5]).toHaveFocus();
});
