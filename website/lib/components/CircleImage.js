import classNames from 'classnames';
import {useEffect, useRef, useState} from 'react';

const loadedImages = new Set();

export function CircleImage({name, inline}) {
  const loadedOnMount = loadedImages.has(name);
  const [loaded, setLoaded] = useState(loadedOnMount);
  const [addTransition, setAddTransition] = useState(true);

  // Safari breaks trying to render the blur filter. Just disable it for
  // WebKit.
  const [isSafari, setIsSafari] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    setIsSafari(CSS.supports('-webkit-backdrop-filter', 'none'));
    if (ref.current.complete) {
      loadedImages.add(name);
      setLoaded(true);
    }
  }, [name]);

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
              'animate-blur-in':
                loaded && addTransition && !loadedOnMount,
            }
          )}
          src={src}
          aria-hidden
          draggable={false}
          style={styles}
          onLoad={() => {
            setAddTransition(true);
            setLoaded(true);
            loadedImages.add(name);
          }}
        />
        {!loaded && (
          <img
            className="absolute right-0 top-0 !mb-4 block h-[200px] w-[200px] scale-95 select-none blur-md sm:!ml-6 sm:block lg:h-[250px] lg:w-[250px]"
            src={inline}
            aria-hidden
            draggable={false}
            style={styles}
          />
        )}
      </div>
      {!isSafari && (
        <img
          className="pointer-events-none absolute left-4 top-8 -z-1 h-[200px] w-[200px] select-none rounded-full opacity-50 blur-2xl filter dark:opacity-50 sm:right-0 sm:left-auto sm:block lg:h-[250px] lg:w-[250px]"
          src={inline}
          aria-hidden
          draggable={false}
        />
      )}
    </div>
  );
}
