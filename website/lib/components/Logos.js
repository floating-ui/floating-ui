import {FloatingDelayGroup} from '@floating-ui/react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './Tooltip';
import {MINI_SPONSORS} from '../../data';

export function Logos({items}) {
  const activeItems = MINI_SPONSORS.filter((item) =>
    items.some((member) => member.MemberId === item.MemberId),
  );

  return (
    <div className="my-10 flex flex-wrap justify-center invert dark:invert-0">
      <FloatingDelayGroup delay={{open: 1000, close: 200}}>
        {activeItems.map((item) => (
          <Tooltip key={item.label} content={item.label}>
            <TooltipTrigger asChild>
              <a
                href={item.url}
                className="mx-0.5 mb-6 inline-block px-4 opacity-70 transition-opacity hover:opacity-100 dark:opacity-30"
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
            </TooltipTrigger>
            <TooltipContent>{item.label}</TooltipContent>
          </Tooltip>
        ))}
      </FloatingDelayGroup>
    </div>
  );
}
