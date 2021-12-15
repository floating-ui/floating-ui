import Tippy from '@tippyjs/react';

export default function Logos({items}) {
  return (
    <div className="gap-8 flex justify-center my-10">
      {items.map((item) => (
        <Tippy
          key={item.label}
          content={item.label}
          theme="light-border"
          interactive
          trigger="mouseenter"
          aria={{content: 'labelledby'}}
        >
          <a
            href={item.url}
            className="opacity-30 hover:opacity-100 transition-opacity"
            rel="noopener noreferrer"
          >
            <img
              className="aspect-square h-12"
              src={item.logo}
              alt={item.label}
            />
          </a>
        </Tippy>
      ))}
    </div>
  );
}
