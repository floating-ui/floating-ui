import {
  Composite,
  CompositeItem,
  FloatingArrow,
  FloatingFocusManager,
  FloatingList,
  FloatingPortal,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListItem,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTransitionStyles,
  useTypeahead,
} from '@floating-ui/react';
import cn from 'classnames';
import {useRouter} from 'next/router';
import {
  cloneElement,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Check, ChevronDown} from 'react-feather';

import {useAppContext} from '../../pages/_app';
import {getPackageContext} from '../utils/getPackageContext';

const initialPackages = [
  {name: 'core', version: 'latest'},
  {name: 'dom', version: 'latest'},
  {name: 'react', version: 'latest'},
  {name: 'react-dom', version: 'latest'},
  {name: 'vue', version: 'latest'},
  {name: 'react-native', version: 'latest'},
];

const options = [
  'Core (@floating-ui/core)',
  'DOM (@floating-ui/dom)',
  'React (@floating-ui/react)',
  'React DOM (@floating-ui/react-dom)',
  'Vue (@floating-ui/vue)',
  'React Native (@floating-ui/react-native)',
];

const optionsLabelMap = {
  'Core (@floating-ui/core)': 'Core',
  'DOM (@floating-ui/dom)': 'DOM',
  'React (@floating-ui/react)': 'React',
  'React DOM (@floating-ui/react-dom)': 'React DOM',
  'Vue (@floating-ui/vue)': 'Vue',
  'React Native (@floating-ui/react-native)': 'React Native',
};

const optionsPkgMap = {
  'Core (@floating-ui/core)': 'core',
  'DOM (@floating-ui/dom)': 'dom',
  'React (@floating-ui/react)': 'react',
  'React DOM (@floating-ui/react-dom)': 'react-dom',
  'Vue (@floating-ui/vue)': 'vue',
  'React Native (@floating-ui/react-native)': 'react-native',
};

const packageOptions = [
  'core',
  'dom',
  'react',
  'react-dom',
  'vue',
  'react-native',
];

const ReactPackageButton = forwardRef(
  function ReactPackageButton({package: pkg, ...props}, ref) {
    const {packageContext, setPackageContext} = useAppContext();
    return (
      <button
        role="radio"
        className="flex cursor-default items-center gap-1.5 rounded bg-rose-500 p-1 px-1.5 text-sm font-semibold text-white outline-transparent transition-colors hover:bg-rose-600 focus-visible:ring-4 focus-visible:ring-rose-500 focus-visible:ring-offset-transparent dark:bg-rose-500/90"
        onClick={() => setPackageContext(pkg)}
        aria-checked={packageContext === pkg}
        ref={ref}
        {...props}
      >
        {packageContext === pkg && (
          <div className="rounded bg-white p-0.5 text-rose-500 dark:bg-gray-900 dark:text-white">
            <Check size={16} />
          </div>
        )}
        {props.children}
      </button>
    );
  },
);

export function ReactSelect() {
  return (
    <Composite className="-mt-2 mb-4 flex gap-1" role="group">
      <CompositeItem
        render={<ReactPackageButton package="react" />}
      >
        React (all features)
      </CompositeItem>
      <CompositeItem
        render={<ReactPackageButton package="react-dom" />}
      >
        React DOM (only positioning)
      </CompositeItem>
    </Composite>
  );
}

function Tooltip({
  children,
  label,
  open,
  onOpenChange,
  openSelectMenu,
}) {
  const arrowRef = useRef(null);
  const {setIsPackageTooltipTouched} = useAppContext();

  const {refs, floatingStyles, context} = useFloating({
    placement: 'bottom-start',
    open,
    onOpenChange,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(10),
      shift({padding: 5}),
      arrow({element: arrowRef, padding: 5}),
    ],
    transform: false,
  });

  const dismiss = useDismiss(context, {
    outsidePress: false,
    referencePress: true,
  });
  const role = useRole(context, {role: 'tooltip'});

  const {getReferenceProps, getFloatingProps} = useInteractions([
    dismiss,
    role,
  ]);

  const ref = useMergeRefs([refs.setReference, children.ref]);

  const {isMounted, styles} = useTransitionStyles(context, {
    duration: {open: 500, close: 0},
    initial: {
      transform: 'translateY(-0.25rem)',
      opacity: 0,
    },
    common: {
      transitionTimingFunction: 'ease-out',
    },
  });

  return (
    <>
      {cloneElement(
        children,
        getReferenceProps({
          ref,
          ...children.props,
        }),
      )}
      {isMounted && (
        <div
          ref={refs.setFloating}
          style={{...floatingStyles, ...styles}}
          className="flex w-[max-content] max-w-[90vw] items-center rounded-md bg-rose-500 py-1 px-2 text-sm font-bold text-white dark:bg-rose-500/90"
          {...getFloatingProps()}
        >
          {label}
          <FloatingArrow
            ref={arrowRef}
            context={context}
            className="fill-rose-500 dark:fill-rose-500/90"
          />
          <div className="-mr-1 flex gap-1">
            <button
              className="ml-4 cursor-default rounded bg-green-200 p-1 px-1.5 text-green-900 transition-colors hover:bg-green-100 hover:text-green-700"
              onClick={() => {
                onOpenChange(false);
                setIsPackageTooltipTouched(true);
              }}
            >
              Accept
            </button>
            <button
              className="cursor-default rounded bg-white p-1 px-1.5 text-gray-900 transition-colors "
              onClick={() => {
                openSelectMenu();
                onOpenChange(false);
                setIsPackageTooltipTouched(true);
              }}
            >
              Change
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Option({
  option,
  getItemProps,
  activeIndex,
  selectedIndex,
  setSelectedIndex,
  setIsOpen,
}) {
  const {setPackageContext} = useAppContext();
  const {ref, index} = useListItem();

  function handleSelect() {
    setSelectedIndex(index);
    setIsOpen(false);
    setPackageContext(optionsPkgMap[option]);
  }

  return (
    <button
      ref={ref}
      role="option"
      aria-selected={index === selectedIndex}
      className={cn(
        'md:text-md flex w-full cursor-default items-center gap-2 rounded-md p-2 text-left text-sm outline-none dark:text-white md:text-base',
        {
          'bg-gray-200/20 dark:bg-gray-400/30':
            index === activeIndex,
          'font-bold': index === selectedIndex,
        },
      )}
      tabIndex={index === activeIndex ? 0 : -1}
      {...getItemProps({
        onClick: handleSelect,
      })}
    >
      <div
        className={cn(
          'relative top-[1px] h-3 w-3 rounded-full',
          {
            'bg-gray-900/30 dark:bg-gray-200/50':
              selectedIndex !== index,
            'bg-rose-500 dark:bg-rose-400':
              selectedIndex === index,
          },
        )}
      />
      <span>{option}</span>
    </button>
  );
}

export function PackageSelect() {
  const {
    packageContext,
    isPackageTooltipTouched,
    setIsPackageTooltipTouched,
    setPackageContext,
  } = useAppContext();
  const pkgIndex = packageOptions.indexOf(packageContext);
  const router = useRouter();
  const [packages, setPackages] = useState(initialPackages);

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      try {
        const packageResults = await Promise.all(
          initialPackages.map(({name}) =>
            fetch(
              `https://registry.npmjs.org/@floating-ui/${name}/latest`,
            ).then((res) => res.json()),
          ),
        );

        if (!ignore) {
          setPackages(
            packageResults.map((pkg, index) => ({
              name: initialPackages[index].name,
              version: pkg.version,
            })),
          );
        }
      } catch (e) {
        //
      }
    }

    fetchData();

    return () => {
      ignore = true;
    };
  }, []);

  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  if (pkgIndex !== selectedIndex) {
    setSelectedIndex(pkgIndex);
  }

  useEffect(() => {
    function handleRouteChangeComplete(path) {
      if (
        !isPackageTooltipTouched &&
        getPackageContext(path) !== 'dom'
      ) {
        setIsTooltipOpen(true);
      }
    }

    router.events.on(
      'routeChangeComplete',
      handleRouteChangeComplete,
    );

    return () => {
      router.events.off(
        'routeChangeComplete',
        handleRouteChangeComplete,
      );
    };
  }, [isPackageTooltipTouched, router]);

  const {refs, floatingStyles, context} = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    strategy: 'fixed',
    placement: 'bottom-start',
    middleware: [
      offset({mainAxis: 10, alignmentAxis: -5}),
      flip({padding: 10}),
      size({
        padding: 10,
        apply({elements, availableWidth, availableHeight}) {
          Object.assign(elements.floating.style, {
            maxWidth: `${availableWidth}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
      }),
    ],
  });

  const elementsRef = useRef([]);
  const labelsRef = useRef([]);

  const click = useClick(context, {event: 'mousedown'});
  const dismiss = useDismiss(context);
  const role = useRole(context, {role: 'listbox'});
  const listNav = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    selectedIndex,
    onNavigate: setActiveIndex,
  });
  const typeahead = useTypeahead(context, {
    listRef: isOpen
      ? labelsRef
      : {current: Object.values(optionsLabelMap)},
    activeIndex,
    selectedIndex,
    onMatch: isOpen
      ? setActiveIndex
      : (index) =>
          setPackageContext(Object.values(optionsPkgMap)[index]),
  });

  const {isMounted, styles} = useTransitionStyles(context, {
    duration: {
      open: 150,
      close: 75,
    },
  });

  const {getReferenceProps, getFloatingProps, getItemProps} =
    useInteractions([typeahead, listNav, role, click, dismiss]);

  const version = packages[selectedIndex]?.version;

  return (
    <>
      <Tooltip
        openSelectMenu={() => setIsOpen(true)}
        open={isTooltipOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsPackageTooltipTouched(true);
          }
          setIsTooltipOpen(open);
        }}
        label="Docs are now tailored to this package"
      >
        <button
          ref={refs.setReference}
          className="inline-flex cursor-default items-center gap-1 whitespace-nowrap rounded-md bg-rose-500 py-1 px-2 text-sm font-bold text-white outline-transparent transition-colors hover:bg-rose-600 focus-visible:ring-4 focus-visible:ring-rose-500 focus-visible:ring-offset-transparent dark:bg-rose-500/90"
          aria-label={`Select the package you are using to tailor the documentation's context to it. Currently selected: ${
            optionsLabelMap[options[selectedIndex]]
          }`}
          {...getReferenceProps()}
        >
          {optionsLabelMap[options[selectedIndex]]}{' '}
          <span className="text-xs opacity-80">
            {version !== 'latest' ? `v${version}` : version}
          </span>
          <ChevronDown size={16} />
        </button>
      </Tooltip>
      {isMounted && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={{...floatingStyles, ...styles}}
              className="w-[24rem] overflow-y-auto rounded-md bg-white/75 p-2 shadow-md outline-none backdrop-blur-xl dark:bg-gray-600/70 z-50"
              {...getFloatingProps()}
            >
              <p
                className="mb-2 py-1 px-3 font-semibold"
                aria-hidden
              >
                By selecting the package you are using, the
                documentation will be tailored to it.
              </p>
              <p
                className="mb-2 py-1 px-3 text-sm opacity-75"
                aria-hidden
              >
                This documentation refers to the latest version
                of each package.
              </p>
              <FloatingList
                elementsRef={elementsRef}
                labelsRef={labelsRef}
              >
                {options.map((option) => (
                  <Option
                    key={option}
                    option={option}
                    getItemProps={getItemProps}
                    activeIndex={activeIndex}
                    selectedIndex={selectedIndex}
                    setSelectedIndex={setSelectedIndex}
                    setIsOpen={setIsOpen}
                  />
                ))}
              </FloatingList>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
