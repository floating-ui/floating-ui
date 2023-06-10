import classNames from 'classnames';
import {useRef, useState} from 'react';
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect';

export function CircleImage({name, inline}) {
  const [isSafari, setIsSafari] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const ref = useRef(null);

  useIsomorphicLayoutEffect(() => {
    setIsSafari(CSS.supports('-webkit-backdrop-filter', 'none'));
    if (ref.current.complete) {
      setLoaded(true);
    }
  }, []);

  const src = `/${name}.jpg`;
  const styles = {clipPath: 'url(#squircle)'};

  return (
    <div className="z-1 relative">
      <div className="relative inline-block lg:block">
        <img
          ref={ref}
          className={classNames(
            'relative block h-[200px] w-[200px] select-none sm:float-right sm:block md:h-[250px] md:w-[250px] lg:!mb-4 lg:!ml-6',
            {
              'animate-blur-in': loaded && !isSafari,
              'opacity-0': isSafari ? false : !loaded,
            }
          )}
          src={src}
          aria-hidden
          draggable={false}
          style={styles}
          onLoad={() => {
            setLoaded(true);
          }}
        />
        {!loaded && (
          <img
            className="absolute right-0 top-0 !mb-4 block h-[200px] w-[200px] scale-95 select-none blur-md supports-[-webkit-backdrop-filter:none]:transform-none sm:!ml-6 sm:block md:h-[250px] md:w-[250px]"
            src={inline}
            aria-hidden
            draggable={false}
            style={styles}
          />
        )}
      </div>
      <img
        className="pointer-events-none absolute top-8 -z-1 h-[200px] w-[200px] select-none rounded-full opacity-50 blur-2xl filter dark:opacity-50 md:h-[250px] md:w-[250px] lg:left-auto lg:right-0 lg:block lg:opacity-75"
        src={inline}
        aria-hidden
        draggable={false}
      />
    </div>
  );
}
