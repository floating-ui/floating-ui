import {useRef, useState} from 'react';
import Tippy from '@tippyjs/react';
import {ChevronDown, ChevronRight} from 'react-feather';

export default function DropdownExample() {
  const normalRef = useRef();
  const screenRef = useRef();
  const lightenRef = useRef();
  const multiplyRef = useRef();
  const darkenRef = useRef();
  const excludeRef = useRef();
  const otherRef = useRef();

  const refsMap = {
    Normal: normalRef,
    Screen: screenRef,
    Lighten: lightenRef,
    Multiply: multiplyRef,
    Other: otherRef,
  };

  const subRefsMap = {
    Darken: darkenRef,
    Exclude: excludeRef,
  };

  const depthRef = useRef(0);
  const focusIndicesRef = useRef([0, 0]);

  const refs = [
    normalRef,
    screenRef,
    lightenRef,
    multiplyRef,
    otherRef,
  ];
  const subRefs = [darkenRef, excludeRef];

  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const instanceRef = useRef();
  const subInstanceRef = useRef();

  const navigation = {
    fn(instance) {
      let lastKeyDownKey;

      function onKeyDown(event) {
        if (document.activeElement === instance.reference) {
          lastKeyDownKey = event.key;
        }

        if (!instance.state.isVisible) {
          if ([' ', 'Enter', 'ArrowDown'].includes(event.key)) {
            if (
              event.key === 'ArrowDown' &&
              document.activeElement === instance.reference
            ) {
              event.preventDefault();
              instance.show();
            }
          }

          return;
        }

        let depth = depthRef.current;
        const focusIndices = focusIndicesRef.current;
        const context = depth === 0 ? refs : subRefs;

        // Navigating while open
        if (
          [
            'ArrowUp',
            'ArrowDown',
            'ArrowRight',
            'ArrowLeft',
            'Tab',
          ].includes(event.key)
        ) {
          event.preventDefault();
        }

        // Dismiss
        if (event.key === 'Escape' || event.key === 'Tab') {
          instance.hide();
          instance.reference.focus();
        }

        if (event.key === 'ArrowUp') {
          const currentIndex =
            focusIndices[depth] - 1 < 0
              ? 0
              : focusIndices[depth] - 1;
          focusIndices[depth] = currentIndex;
          context[currentIndex].current.focus();
        }

        if (event.key === 'ArrowDown') {
          const currentIndex =
            focusIndices[depth] + 1 > context.length - 1
              ? context.length - 1
              : focusIndices[depth] + 1;
          focusIndices[depth] = currentIndex;
          context[currentIndex].current.focus();
        }

        if (
          ['ArrowRight', ' ', 'Enter'].includes(event.key) &&
          focusIndices[0] === 4 &&
          depth === 0
        ) {
          depthRef.current = depth = 1;
          focusIndices[depth] = 1;
          refs[4].current._tippy?.show();
        }

        if (event.key === 'ArrowLeft' && depth === 1) {
          depthRef.current = depth = 0;
          const currentIndex = focusIndices[depth];
          refs[currentIndex].current.focus();
          refs[4].current._tippy?.hide();
        }
      }

      function onMouseDown() {
        lastKeyDownKey = null;
        focusIndicesRef.current = [-1, -1];
      }

      return {
        onCreate() {
          document.addEventListener('keydown', onKeyDown);
          document.addEventListener('mousedown', onMouseDown);
        },
        onDestroy() {
          document.removeEventListener('keydown', onKeyDown);
          document.removeEventListener('mousedown', onMouseDown);
        },
        onHide() {
          focusIndicesRef.current = [0, 0];
        },
        onMount() {
          if (
            ['ArrowDown', ' ', 'Enter'].includes(lastKeyDownKey)
          ) {
            refs[0].current.focus();
          }
        },
      };
    },
  };

  function selectOption(selectedOption) {
    setSelectedOption(selectedOption);
    subInstanceRef.current?.unmount();
    instanceRef.current?.unmount();
    instanceRef.current?.reference.focus();
  }

  return (
    <Tippy
      className="p-0"
      content={
        <ul className="text-left text-lg p-1">
          {['Normal', 'Screen', 'Lighten', 'Multiply'].map(
            (option) => (
              <li key={option}>
                <button
                  role="menuitem"
                  ref={refsMap[option]}
                  className="hover:text-gray-50 hover:bg-gray-800 rounded px-2 py-1 w-full text-left"
                  onClick={() => selectOption(option)}
                >
                  {option}
                </button>
              </li>
            )
          )}
          <li>
            <Tippy
              content={
                <ul className="text-left text-lg p-1">
                  {['Darken', 'Exclude'].map((option) => (
                    <li key={option}>
                      <button
                        role="menuitem"
                        className="hover:text-gray-50 hover:bg-gray-800 rounded px-2 p-1 w-full text-left"
                        ref={subRefsMap[option]}
                        onClick={() => selectOption(option)}
                      >
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>
              }
              placement="right-start"
              theme="light-border"
              animation="perspective-subtle"
              trigger="mouseenter click"
              duration={[250, 150]}
              interactive
              maxWidth={250}
              offset={({placement}) => [
                placement.endsWith('end') ? 4 : -4,
                4,
              ]}
              arrow={false}
              appendTo={() => document.body}
              role="menu"
              delay={[0, 50]}
              onMount={() => setIsSubMenuOpen(true)}
              onHide={() => setIsSubMenuOpen(false)}
              onClickOutside={({unmount}, event) => {
                if (
                  !instanceRef.current.popper.contains(
                    event.target
                  )
                ) {
                  instanceRef.current.unmount();
                  unmount();
                }
              }}
              onCreate={(instance) => {
                subInstanceRef.current = instance;
                instance.popper.querySelector(
                  '.tippy-content'
                ).style.padding = 0;
              }}
              plugins={[
                {
                  fn(instance) {
                    function onKeyDown(event) {
                      if (
                        event.key === 'Escape' ||
                        event.key === 'Tab'
                      ) {
                        instance.unmount();
                      }
                    }

                    return {
                      onMount() {
                        if (focusIndicesRef.current[0] === 4) {
                          subRefs[0].current.focus();
                        }
                      },
                      onHide() {
                        depthRef.current = 0;
                      },
                      onCreate() {
                        document.addEventListener(
                          'keydown',
                          onKeyDown
                        );
                      },
                      onDestroy() {
                        document.removeEventListener(
                          'keydown',
                          onKeyDown
                        );
                      },
                    };
                  },
                },
              ]}
            >
              <button
                role="menuitem"
                ref={otherRef}
                className="flex justify-between items-center hover:text-gray-50 hover:bg-gray-800 focus:bg-gray-200 focus:text-gray-900 rounded px-2 p-1 w-full text-left"
              >
                Other... <ChevronRight />
              </button>
            </Tippy>
          </li>
        </ul>
      }
      placement="bottom-start"
      theme="light-border"
      trigger="click"
      animation="perspective-subtle"
      duration={[250, 150]}
      interactive
      maxWidth={250}
      offset={[0, 2]}
      arrow={false}
      appendTo={() => document.body}
      hideOnClick={!isSubMenuOpen}
      onCreate={(instance) => {
        instanceRef.current = instance;
        instance.popper.querySelector(
          '.tippy-content'
        ).style.padding = 0;
      }}
      role="menu"
      popperOptions={{
        modifiers: [
          {
            name: 'sameWidth',
            enabled: true,
            phase: 'beforeWrite',
            requires: ['computeStyles'],
            fn: ({state}) => {
              state.styles.popper.width = `${state.rects.reference.width}px`;
            },
            effect: ({state}) => {
              state.elements.popper.style.width = `${state.elements.reference.offsetWidth}px`;
            },
          },
        ],
      }}
      plugins={[navigation]}
    >
      <button className="flex items-center mx-auto text-lg bg-blue-600 text-gray-50 hover:bg-blue-700 p-3 transition-colors rounded">
        {selectedOption ?? 'Blend Mode'} <ChevronDown />
      </button>
    </Tippy>
  );
}
