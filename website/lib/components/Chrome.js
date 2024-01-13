import cn from 'classnames';
import {createContext, useContext, useRef} from 'react';
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect';

const ChromeContext = createContext();
export const useChromeContext = () => useContext(ChromeContext);

export const Chrome = ({
  children,
  center,
  scrollable = 'none',
  relative = true,
  label,
  scrollHeight = 305,
  shadow = true,
  tall = false,
}) => {
  const scrollableRef = useRef();

  const scrollableX = scrollable === 'both' || scrollable === 'x';
  const scrollableY = scrollable === 'both' || scrollable === 'y';
  const isScrollable = scrollableX || scrollableY;

  useIsomorphicLayoutEffect(() => {
    if (scrollableY) {
      scrollableRef.current.scrollTop =
        scrollableRef.current.scrollHeight / 2 -
        scrollableRef.current.offsetHeight / 2;
    }

    if (scrollableX) {
      scrollableRef.current.scrollLeft =
        scrollableRef.current.scrollWidth / 2 -
        scrollableRef.current.offsetWidth / 2;
    }
  }, [scrollableY, scrollableX]);

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg text-gray-900 [color-scheme:light] dark:border-none bg-clip-padding',
        {
          shadow,
          'border border-black/10 dark:border-gray-700': shadow,
        },
      )}
    >
      <div className="bg-gray-75 dark:bg-gray-600/60 dark:text-white">
        <div
          className={`absolute mx-4 flex h-12 items-center gap-2 ${
            label ? 'sm:flex' : ''
          }`}
        >
          <div
            className="h-3 w-3 rounded-full"
            style={{background: '#ec695e'}}
          />
          <div
            className="h-3 w-3 rounded-full"
            style={{background: '#f4bf4f'}}
          />
          <div
            className="h-3 w-3 rounded-full"
            style={{background: '#61c653'}}
          />
        </div>
        <div className="flex h-12 items-center justify-center font-semibold">
          {label}
        </div>
      </div>
      <div className="will-change-transform">
        <div
          ref={scrollableRef}
          className={cn('h-[20rem] overflow-hidden bg-gray-50 p-2', {
            'grid place-items-center': center,
            'overflow-y-auto': scrollableY,
            'overflow-x-auto': scrollableX,
            'h-[50rem] md:h-[30rem]': tall,
            relative,
          })}
        >
          {isScrollable && (
            <div
              className={
                scrollableX ? 'w-[180vw] md:w-[75rem] lg:w-[90rem]' : undefined
              }
              style={{
                height: scrollableY ? scrollHeight : 1,
              }}
            />
          )}
          <ChromeContext.Provider value={scrollableRef}>
            {children}
          </ChromeContext.Provider>
          {isScrollable && (
            <div
              className={
                scrollableX ? 'w-[180vw] md:w-[75rem] lg:w-[90rem]' : undefined
              }
              style={{
                height: scrollableY ? scrollHeight : 1,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
