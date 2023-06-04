export function CircleImage({src}) {
  return (
    <div className="z-1 relative">
      <img
        className="!mb-4 block h-[200px] w-[200px] select-none sm:float-right sm:!ml-6 sm:block lg:h-[250px] lg:w-[250px]"
        src={src}
        aria-hidden
        draggable={false}
        style={{
          clipPath: 'url(#squircle)',
        }}
      />
      <img
        className="pointer-events-none absolute left-4 top-8 -z-1 h-[200px] w-[200px] select-none rounded-3xl opacity-70 blur-3xl filter dark:opacity-50 sm:right-0 sm:left-auto sm:block lg:h-[250px] lg:w-[250px]"
        src={src}
        aria-hidden
        draggable={false}
      />
    </div>
  );
}
