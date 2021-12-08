import {useRef} from 'react';
import cn from 'classnames';
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect';

export const Chrome = ({
  children,
  // dark,
  center,
  scrollable,
  className,
}) => {
  const scrollableRef = useRef();

  useIsomorphicLayoutEffect(() => {
    if (scrollable) {
      scrollableRef.current.scrollTop = 250;
    }
  }, [scrollable]);

  return (
    <div
      className={
        `relative bg-gray-50 rounded-lg overflow-hidden text-gray-900` +
        (className ? ` ${className}` : ' h-64')
      }
    >
      <div className="absolute w-full flex gap-2 bg-gray-100 p-4 z-10 top-0">
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
      <div
        ref={scrollableRef}
        className={cn('overflow-hidden relative p-2 mt-12', {
          'grid place-items-center': center,
          'overflow-scroll': scrollable,
        })}
        style={{height: 'calc(100% - 3rem)'}}
      >
        {scrollable && <div style={{height: 350, width: 1}} />}
        {children}
        {scrollable && <div style={{height: 350, width: 1}} />}
      </div>
    </div>
  );
};
