import Tippy from '@tippyjs/react';

export function Logos({items}) {
  return (
    <div className="gap-8 flex flex-wrap justify-center my-10 invert dark:invert-0">
      {items.map((item) => (
        <Tippy
          key={item.label}
          content={item.label}
          theme="light-border"
          trigger="mouseenter"
          aria={{content: 'labelledby'}}
        >
          <a
            href={item.url}
            className="opacity-70 dark:opacity-30 hover:opacity-100 transition-opacity"
            rel="noopener noreferrer"
          >
            <img
              className="h-12"
              loading="lazy"
              src={item.logo}
              alt={item.label}
              width={48}
              height={48}
            />
          </a>
        </Tippy>
      ))}
    </div>
  );
}
