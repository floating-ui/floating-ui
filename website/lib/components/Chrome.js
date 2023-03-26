import cn from 'classnames';
import {useRef} from 'react';
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect';

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

  const scrollableX =
    scrollable === 'both' || scrollable === 'x';
  const scrollableY =
    scrollable === 'both' || scrollable === 'y';
  const isScrollable = scrollableX || scrollableY;

  useIsomorphicLayoutEffect(() => {
    if (scrollableY) {
      scrollableRef.current.scrollTop =
        scrollableRef.current.scrollHeight / 2 -
        scrollableRef.current.offsetHeight / 2;
    }
  }, [scrollableY]);

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border-gray-1000 text-gray-900 [color-scheme:light] dark:border-none',
        {
          shadow,
          'border border-gray-100': shadow,
        }
      )}
    >
      <div className="bg-gray-75">
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
        <div className="flex h-12 items-center justify-center font-bold">
          {label}
        </div>
      </div>
      <div className="will-change-transform">
        <div
          ref={scrollableRef}
          className={cn(
            'h-[20rem] overflow-hidden bg-gray-50 p-2',
            {
              'grid place-items-center': center,
              'overflow-y-auto': scrollableY,
              'overflow-x-auto': scrollableX,
              'h-[50rem] md:h-[30rem]': tall,
              relative,
            }
          )}
        >
          {isScrollable && (
            <div
              style={{
                height: scrollableY ? scrollHeight : 1,
                width: scrollableX ? '82rem' : 1,
              }}
            />
          )}
          {children}
          {isScrollable && (
            <div
              style={{
                height: scrollableY ? scrollHeight : 1,
                width: scrollableX ? '82rem' : 1,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
