import {JSX, ParentProps, mergeProps, splitProps} from 'solid-js';

export const Button = (
  props: ParentProps<JSX.ButtonHTMLAttributes<HTMLButtonElement>>,
) => {
  const [local, rest] = splitProps(props, ['class']);
  return (
    <button
      {...rest}
      class={`${
        local.class ? local.class : ''
      } bg-slate-200/90 rounded p-2 px-3 transition-colors hover:bg-slate-200/50 data-[open]:bg-slate-200/50
		`}
    />
  );
};
