import {useEffect, useRef, useState} from 'react';

export function CircleImage({src}) {
  const [loaded, setLoaded] = useState(false);
  // Safari breaks trying to render the blur filter. Just disable it for
  // WebKit.
  const [isSafari, setIsSafari] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    setIsSafari(CSS.supports('-webkit-backdrop-filter', 'none'));
    if (ref.current.complete) {
      setLoaded(true);
    }
  }, []);

  const styles = {
    clipPath: 'url(#squircle)',
    transform: loaded ? 'scale(1)' : 'scale(0.9)',
    opacity: loaded ? '1' : '0',
    transition: isSafari
      ? undefined
      : 'transform 1s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s',
  };

  return (
    <div className="z-1 relative">
      <img
        ref={ref}
        className="relative !mb-4 block h-[200px] w-[200px] select-none sm:float-right sm:!ml-6 sm:block lg:h-[250px] lg:w-[250px]"
        src={src}
        aria-hidden
        draggable={false}
        style={styles}
        onLoad={() => setLoaded(true)}
      />
      {loaded && !isSafari && (
        <img
          className="pointer-events-none absolute left-4 top-8 -z-1 h-[200px] w-[200px] select-none rounded-xl opacity-50 blur-3xl filter dark:opacity-50 sm:right-0 sm:left-auto sm:block lg:h-[250px] lg:w-[250px]"
          src={src}
          aria-hidden
          draggable={false}
          style={{
            ...styles,
            opacity: undefined,
            clipPath: undefined,
          }}
        />
      )}
    </div>
  );
}
