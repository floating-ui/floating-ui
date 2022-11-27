import React, {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
} from 'react';
import {
  useFloating,
  offset,
  flip,
  useListNavigation,
  useTypeahead,
  useInteractions,
  useRole,
  useClick,
  useDismiss,
  FloatingFocusManager,
  autoUpdate,
  size,
  FloatingOverlay,
  ContextData,
} from '@floating-ui/react-dom-interactions';
import {useEvent} from '../../../src/utils/useEvent';

interface SelectContextValue {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
  listRef: React.MutableRefObject<Array<HTMLLIElement | null>>;
  setOpen: (open: boolean) => void;
  onChange: (value: string) => void;
  getItemProps: (userProps?: React.HTMLProps<HTMLElement>) => any;
  dataRef: ContextData;
}

const SelectContext = createContext({} as SelectContextValue);

function Arrow({dir}: {dir: 'down' | 'up'}) {
  return (
    <div
      style={{
        display: 'flex',
        transform: dir === 'up' ? 'rotate(180deg)' : undefined,
      }}
    >
      <svg width={16} height={16} viewBox="0 0 512 512">
        <g
          transform={`translate(0,512) scale(0.1,-0.1)`}
          fill="currentColor"
          stroke="none"
        >
          <path
            d="M783 3543 c-29 -6 -63 -49 -63 -79 0 -15 20 -46 52 -81 29 -32 434
-451 901 -930 834 -858 849 -873 887 -873 38 0 53 15 887 873 467 479 872 898
901 930 59 65 64 91 28 134 l-24 28 -1774 1 c-975 1 -1783 -1 -1795 -3z"
          />
        </g>
      </svg>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 512 512">
      <g
        transform="translate(0,512) scale(0.1,-0.1)"
        fill="currentColor"
        stroke="none"
      >
        <path
          d="M4468 4401 c-36 -10 -88 -31 -115 -46 -32 -18 -446 -425 -1245 -1224
l-1198 -1196 -532 531 c-293 292 -555 546 -581 563 -163 110 -396 111 -563 3
-174 -113 -264 -327 -221 -529 34 -158 -4 -114 824 -944 509 -510 772 -766
808 -788 108 -65 264 -87 389 -55 146 38 67 -37 1582 1478 896 896 1411 1418
1428 1447 52 92 69 156 69 269 0 155 -42 259 -146 363 -127 127 -320 176 -499
128z"
        />
      </g>
    </svg>
  );
}

export const Option = React.memo(
  ({
    children,
    index = 0,
    value,
  }: {
    children: React.ReactNode;
    index?: number;
    value: string;
  }) => {
    const {
      selectedIndex,
      setSelectedIndex,
      listRef,
      setOpen,
      onChange,
      activeIndex,
      setActiveIndex,
      getItemProps,
      dataRef,
    } = useContext(SelectContext);

    console.log('rendering');

    function handleSelect() {
      setSelectedIndex(index);
      onChange(value);
      setOpen(false);
      setActiveIndex(null);
    }

    function handleKeyDown(event: React.KeyboardEvent) {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleSelect();
      }

      if (event.key === ' ') {
        event.preventDefault();
      }
    }

    function handleKeyUp(event: React.KeyboardEvent) {
      if (event.key === ' ' && !dataRef.current.typing) {
        handleSelect();
      }
    }

    return (
      <li
        className="Option"
        role="option"
        ref={(node) => (listRef.current[index] = node)}
        tabIndex={activeIndex === index ? 0 : 1}
        aria-selected={activeIndex === index}
        data-selected={selectedIndex === index}
        {...getItemProps({
          onClick: handleSelect,
          onKeyDown: handleKeyDown,
          onKeyUp: handleKeyUp,
        })}
      >
        {children} {selectedIndex === index && <CheckIcon />}
      </li>
    );
  }
);

export const OptionGroup: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({children, label}) => {
  return (
    <li className="OptionGroup">
      <div className="OptionGroupLabel">{label}</div>
      <ul>{children}</ul>
    </li>
  );
};

export const Select: React.FC<{
  onChange: (value: string) => void;
  render: (selectedIndex: number) => React.ReactNode;
  value: string;
  children: React.ReactNode;
}> = ({children, value, render, onChange: unstable_onChange = () => {}}) => {
  const listItemsRef = useRef<Array<HTMLLIElement | null>>([]);
  const listContentRef = useRef([
    'Select...',
    ...(Children.map(children, (child) =>
      Children.map(
        isValidElement(child) && child.props.children,
        (child) => child.props.value
      )
    ) ?? []),
  ]);

  const onChange = useEvent(unstable_onChange);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(
    Math.max(0, listContentRef.current.indexOf(value))
  );
  const [pointer, setPointer] = useState(false);

  if (!open && pointer) {
    setPointer(false);
  }

  const {x, y, reference, floating, strategy, context} = useFloating({
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({padding: 8}),
      size({
        apply({rects, availableHeight, elements}) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
        padding: 8,
      }),
    ],
  });

  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    useClick(context),
    useRole(context, {role: 'listbox'}),
    useDismiss(context),
    useListNavigation(context, {
      listRef: listItemsRef,
      activeIndex,
      selectedIndex,
      onNavigate: setActiveIndex,
    }),
    useTypeahead(context, {
      listRef: listContentRef,
      onMatch: open ? setActiveIndex : setSelectedIndex,
      activeIndex,
      selectedIndex,
    }),
  ]);

  // Scroll the active or selected item into view when in `controlledScrolling`
  // mode (i.e. arrow key nav).
  useLayoutEffect(() => {
    if (open && activeIndex != null && !pointer) {
      requestAnimationFrame(() => {
        listItemsRef.current[activeIndex]?.scrollIntoView({
          block: 'nearest',
        });
      });
    }
  }, [open, activeIndex, pointer]);

  let optionIndex = 0;
  const options = [
    <ul key="default">
      <Option value="default">Select...</Option>
    </ul>,
    ...(Children.map(
      children,
      (child) =>
        isValidElement(child) && (
          <ul
            key={child.props.label}
            role="group"
            aria-labelledby={`floating-ui-select-${child.props.label}`}
          >
            <li
              role="presentation"
              id={`floating-ui-select-${child.props.label}`}
              className="SelectGroupLabel"
              aria-hidden="true"
            >
              {child.props.label}
            </li>
            {Children.map(child.props.children, (child) =>
              cloneElement(child, {index: 1 + optionIndex++})
            )}
          </ul>
        )
    ) ?? []),
  ];

  const contextValue = React.useMemo(() => {
    return {
      selectedIndex,
      setSelectedIndex,
      activeIndex,
      setActiveIndex,
      listRef: listItemsRef,
      setOpen,
      onChange,
      getItemProps,
      dataRef: context.dataRef,
    };
  }, [
    selectedIndex,
    activeIndex,
    setOpen,
    context.dataRef,
    onChange,
    getItemProps,
  ]);

  return (
    <SelectContext.Provider value={contextValue}>
      <button
        {...getReferenceProps({
          ref: reference,
          className: 'SelectButton',
        })}
      >
        {render(selectedIndex - 1)}
        <Arrow dir="down" />
      </button>
      {open && (
        <FloatingOverlay lockScroll>
          <FloatingFocusManager context={context} initialFocus={selectedIndex}>
            <div
              {...getFloatingProps({
                ref: floating,
                className: 'Select',
                style: {
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                  overflow: 'auto',
                },
                onPointerMove() {
                  setPointer(true);
                },
                onKeyDown(event) {
                  setPointer(false);

                  if (event.key === 'Tab') {
                    setOpen(false);
                  }
                },
              })}
            >
              {options}
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      )}
    </SelectContext.Provider>
  );
};

const decades = ['1990s', '2000s', '2010s', '2020s'];
const films = [
  {
    name: 'Toy Story',
    icon: 'https://upload.wikimedia.org/wikipedia/en/1/13/Toy_Story.jpg',
    decade: '1990s',
  },
  {
    name: 'A Bugs Life',
    icon: 'https://upload.wikimedia.org/wikipedia/en/c/cc/A_Bug%27s_Life.jpg',
    decade: '1990s',
  },
  {
    name: 'Toy Story 2',
    icon: 'https://upload.wikimedia.org/wikipedia/en/c/c0/Toy_Story_2.jpg',
    decade: '1990s',
  },
  {
    name: 'Monsters, Inc.',
    icon: 'https://upload.wikimedia.org/wikipedia/en/6/63/Monsters_Inc.JPG',
    decade: '2000s',
  },
  {
    name: 'Finding Nemo',
    icon: 'https://upload.wikimedia.org/wikipedia/en/2/29/Finding_Nemo.jpg',
    decade: '2000s',
  },
  {
    name: 'The Incredibles',
    icon: 'https://upload.wikimedia.org/wikipedia/en/2/27/The_Incredibles_%282004_animated_feature_film%29.jpg',
    decade: '2000s',
  },
  {
    name: 'Cars',
    icon: 'https://upload.wikimedia.org/wikipedia/en/3/34/Cars_2006.jpg',
    decade: '2000s',
  },
  {
    name: 'Ratatouille',
    icon: 'https://upload.wikimedia.org/wikipedia/en/5/50/RatatouillePoster.jpg',
    decade: '2000s',
  },
  {
    name: 'WALL-E',
    icon: 'https://upload.wikimedia.org/wikipedia/en/c/c2/WALL-Eposter.jpg',
    decade: '2000s',
  },
  {
    name: 'Up',
    icon: 'https://upload.wikimedia.org/wikipedia/en/0/05/Up_%282009_film%29.jpg',
    decade: '2000s',
  },
  {
    name: 'Cars 2',
    icon: 'https://upload.wikimedia.org/wikipedia/en/7/7f/Cars_2_Poster.jpg',
    decade: '2010s',
  },
  {
    name: 'Toy Story 3',
    icon: 'https://upload.wikimedia.org/wikipedia/en/6/69/Toy_Story_3_poster.jpg',
    decade: '2010s',
  },
  {
    name: 'Brave',
    icon: 'https://upload.wikimedia.org/wikipedia/en/9/96/Brave_Poster.jpg',
    decade: '2010s',
  },
  {
    name: 'Monsters University',
    icon: 'https://upload.wikimedia.org/wikipedia/en/2/2a/Monsters_University_poster_3.jpg',
    decade: '2010s',
  },
  {
    name: 'Inside Out',
    icon: 'https://upload.wikimedia.org/wikipedia/en/0/0a/Inside_Out_%282015_film%29_poster.jpg',
    decade: '2010s',
  },
  {
    name: 'The Good Dinosaur',
    icon: 'https://upload.wikimedia.org/wikipedia/en/8/80/The_Good_Dinosaur_poster.jpg',
    decade: '2010s',
  },
  {
    name: 'Finding Dory',
    icon: 'https://upload.wikimedia.org/wikipedia/en/3/3e/Finding_Dory.jpg',
    decade: '2010s',
  },
  {
    name: 'Cars 3',
    icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/94/Cars_3_poster.jpg/220px-Cars_3_poster.jpg',
    decade: '2010s',
  },
  {
    name: 'Coco',
    icon: 'https://upload.wikimedia.org/wikipedia/en/9/98/Coco_%282017_film%29_poster.jpg',
    decade: '2010s',
  },
  {
    name: 'Incredibles 2',
    icon: 'https://upload.wikimedia.org/wikipedia/en/1/1f/Incredibles_2_%282018_animated_film%29.jpg',
    decade: '2010s',
  },
  {
    name: 'Toy Story 4',
    icon: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Toy_Story_4_poster.jpg',
    decade: '2010s',
  },
  {
    name: 'Onward',
    icon: 'https://upload.wikimedia.org/wikipedia/en/0/03/Onward_poster.jpg',
    decade: '2020s',
  },
  {
    name: 'Soul',
    icon: 'https://upload.wikimedia.org/wikipedia/en/3/39/Soul_%282020_film%29_poster.jpg',
    decade: '2020s',
  },
  {
    name: 'Luca',
    icon: 'https://upload.wikimedia.org/wikipedia/en/3/33/Luca_%282021_film%29.png',
    decade: '2020s',
  },
];

export function Main() {
  const [c, setC] = useState(0);

  // useEffect(() => {
  //   setInterval(() => {
  //     setC((c) => c + 1);
  //   }, 100);
  // }, []);

  const options = React.useMemo(
    () =>
      decades.map((decade) => (
        <OptionGroup key={decade} label={decade}>
          {films
            .filter((item) => item.decade === decade)
            .map(({name}) => (
              <Option key={name} value={name}>
                {name}
              </Option>
            ))}
        </OptionGroup>
      )),
    []
  );

  return (
    <div className="App">
      <div>
        <h1>Floating UI Select</h1>
        <Select
          value=""
          render={(selectedIndex) => (
            <div>
              {films[selectedIndex] ? (
                <img
                  className="OptionIcon"
                  alt="Poster"
                  src={films[selectedIndex]?.icon}
                />
              ) : null}
              {films[selectedIndex]?.name ?? 'Select...'}{' '}
            </div>
          )}
          onChange={console.log}
        >
          {options}
        </Select>
      </div>
    </div>
  );
}
