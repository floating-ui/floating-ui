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
        'rounded-lg overflow-hidden text-gray-900 [color-scheme:light] dark:border-none border-gray-1000',
        {
          shadow,
          'border border-gray-100': shadow,
        }
      )}
    >
      <div className="bg-gray-75">
        <div
          className={`absolute flex items-center gap-2 mx-4 h-12 ${
            label ? 'sm:flex' : ''
          }`}
        >
          <div
            className="rounded-full w-3 h-3"
            style={{background: '#ec695e'}}
          />
          <div
            className="rounded-full w-3 h-3"
            style={{background: '#f4bf4f'}}
          />
          <div
            className="rounded-full w-3 h-3"
            style={{background: '#61c653'}}
          />
        </div>
        <div className="flex font-bold justify-center items-center h-12">
          {label}
        </div>
      </div>
      <div className="will-change-transform">
        <div
          ref={scrollableRef}
          className={cn(
            'bg-gray-50 overflow-hidden p-2 h-[20rem]',
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
                width: scrollableX ? '76rem' : 1,
              }}
            />
          )}
          {children}
          {isScrollable && (
            <div
              style={{
                height: scrollableY ? scrollHeight : 1,
                width: scrollableX ? '76rem' : 1,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
