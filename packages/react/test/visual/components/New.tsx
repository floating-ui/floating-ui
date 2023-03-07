import {useFloating} from '@floating-ui/react';

export function New() {
  const {x, y, strategy, refs} = useFloating();

  return (
    <>
      <h1 className="text-5xl font-bold mb-8">New</h1>
      <div className="grid place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
        <div ref={refs.setReference}>Reference</div>
        <div
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
        >
          Floating
        </div>
      </div>
    </>
  );
}
