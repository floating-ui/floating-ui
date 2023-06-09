import classNames from 'classnames';
import {useRef, useState} from 'react';
import {useIsomorphicLayoutEffect} from 'usehooks-ts';

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
      <div className="relative inline-block sm:block">
        <img
          ref={ref}
          className={classNames(
            'relative block h-[200px] w-[200px] select-none sm:float-right sm:!mb-4 sm:!ml-6 sm:block lg:h-[250px] lg:w-[250px]',
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
            className="absolute right-0 top-0 !mb-4 block h-[200px] w-[200px] scale-95 select-none blur-md supports-[-webkit-backdrop-filter:none]:transform-none sm:!ml-6 sm:block lg:h-[250px] lg:w-[250px]"
            src={inline}
            aria-hidden
            draggable={false}
            style={styles}
          />
        )}
      </div>
      <img
        className="pointer-events-none absolute left-4 top-8 -z-1 h-[200px] w-[200px] select-none rounded-full opacity-50 blur-2xl filter supports-[-webkit-backdrop-filter:none]:hidden dark:opacity-50 sm:right-0 sm:left-auto sm:block lg:h-[250px] lg:w-[250px]"
        src={inline}
        aria-hidden
        draggable={false}
      />
    </div>
  );
}
