import classNames from 'classnames';
import {useEffect, useRef, useState} from 'react';

import b64images from '../../images.json';

export function CircleImage({name}) {
  const [loaded, setLoaded] = useState(false);
  const inline = `data:image/png;base64,${b64images[name]}`;
  const src = `/${name}.png`;
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current.complete) {
      setLoaded(true);
    }
  }, []);

  return (
    <div className="relative -top-16 z-10 -mb-16 dark:brightness-90 dark:contrast-125 md:-mb-12 lg:-top-24 lg:-mb-24">
      <img
        ref={ref}
        className={classNames(
          'z-1 relative left-[50%] !-ml-[100px] block h-[200px] w-[200px] select-none sm:block md:h-[250px] md:w-[250px] lg:!-ml-[125px]',
          {
            'animate-blur-in': loaded,
            'opacity-0': !loaded,
          },
        )}
        src={src}
        aria-hidden
        draggable={false}
        onLoad={() => setLoaded(true)}
      />
      {!loaded && (
        <img
          className="absolute top-0 left-[50%] !-ml-[100px] block h-[200px] w-[200px] scale-95 select-none blur-md sm:block md:h-[250px] md:w-[250px] lg:!-ml-[125px]"
          src={inline}
          aria-hidden
          draggable={false}
        />
      )}
    </div>
  );
}
