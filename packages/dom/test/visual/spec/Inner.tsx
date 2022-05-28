import {detectOverflow} from '@floating-ui/core';
import {useFloating, offset, shift, autoUpdate} from '@floating-ui/react-dom';
import {useEffect, useRef, useState} from 'react';
import {useScroll} from '../utils/useScroll';

const ALIGN_INDEX = 10;

export function Inner() {
  const [open, setOpen] = useState(false);
  const scrollTopRef = useRef<number | null>(null);
  const {x, y, reference, floating, strategy, update, refs} = useFloating({
    whileElementsMounted: (a, b, c) =>
      autoUpdate(a, b, c, {
        elementResize: false,
      }),
    strategy: 'fixed',
    middleware: [
      offset(({elements, rects}) => {
        const two = elements.floating.querySelectorAll('li')[ALIGN_INDEX];
        return (
          -two.offsetTop - rects.reference.height / 2 - two.offsetHeight / 2
        );
      }),
      shift(),
      {
        name: 'size',
        async fn(middlewareArguments) {
          const {
            y: prevY,
            elements: {floating},
          } = middlewareArguments;
          const overflow = await detectOverflow(middlewareArguments, {
            padding: 8,
          });

          // Undo the previous mutation to work from the initial size.
          if (floating.style.maxHeight) {
            floating.style.maxHeight = '';
            return {
              reset: {
                rects: true,
              },
            };
          }

          const diffY = Math.max(0, overflow.top);

          Object.assign(floating.style, {
            maxHeight: `${
              floating.scrollHeight - diffY - Math.max(0, overflow.bottom)
            }px`,
          });

          floating.scrollTop = scrollTopRef.current ?? diffY;

          return {
            y: prevY + diffY,
          };
        },
      },
    ],
  });

  useEffect(() => {
    if (!open) {
      scrollTopRef.current = null;
    }
  });

  const {scrollRef} = useScroll({refs, update});

  return (
    <>
      <h1>Inner</h1>
      <p>
        Anchors to an element inside the floating element. Once the user has
        scrolled the floating element, it will no longer anchor to the item
        inside of it.
      </p>
      <div className="container">
        <div className="scroll" style={{position: 'relative'}} ref={scrollRef}>
          <div
            ref={reference}
            className="reference"
            onClick={() => setOpen(!open)}
            style={{
              height: 40,
            }}
          >
            Reference
          </div>
          {open && (
            <div
              ref={floating}
              className="floating"
              style={{
                position: strategy,
                top: y ?? '',
                left: x ?? '',
                height: 'auto',
                width: 'auto',
                overflow: 'auto',
                background: 'black',
              }}
              onWheel={() => {
                scrollTopRef.current = refs.floating.current?.scrollTop ?? null;
              }}
            >
              <ul
                style={{
                  listStyle: 'none',
                  width: 'max-content',
                  lineHeight: '2',
                  padding: '0',
                }}
              >
                {[...Array(50)].map((_, index) => (
                  <li
                    key={index}
                    style={{
                      borderTop: index !== 0 ? '1px solid gray' : '',
                      padding: '5px 15px',
                      background: index === ALIGN_INDEX ? 'white' : '',
                      color: index === ALIGN_INDEX ? 'black' : 'white',
                    }}
                  >
                    List item {index + 1}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
