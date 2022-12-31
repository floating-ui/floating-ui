import cn from 'classnames';
import {useRef} from 'react';
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect';

export const Chrome = ({
  children,
  center,
  scrollable,
  relative = true,
  label,
  scrollHeight = 305,
  shadow = true,
}) => {
  const scrollableRef = useRef();

  useIsomorphicLayoutEffect(() => {
    if (scrollable) {
      scrollableRef.current.scrollTop =
        scrollableRef.current.scrollHeight / 2 -
        scrollableRef.current.offsetHeight / 2;
    }
  }, [scrollable]);

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
      <div className="bg-gray-75 h-12">
        <div
          className={`absolute flex gap-2 m-4 ${
            label ? 'hidden sm:flex' : ''
          }`}
        >
          <div
            className="rounded-full w-4 h-4"
            style={{background: '#ec695e'}}
          />
          <div
            className="rounded-full w-4 h-4"
            style={{background: '#f4bf4f'}}
          />
          <div
            className="rounded-full w-4 h-4"
            style={{background: '#61c653'}}
          />
        </div>
        <div className="flex font-bold justify-center items-center h-12">
          {label}
        </div>
      </div>
      <div
        ref={scrollableRef}
        className={cn(
          'bg-gray-50 overflow-hidden p-2 h-[20rem]',
          {
            'grid place-items-center': center,
            'overflow-y-auto': scrollable,
            relative,
          }
        )}
      >
        {scrollable && (
          <div style={{height: scrollHeight, width: 1}} />
        )}
        {children}
        {scrollable && (
          <div style={{height: scrollHeight, width: 1}} />
        )}
      </div>
    </div>
  );
};
