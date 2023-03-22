import {useState} from 'react';
import {Check, Edit} from 'react-feather';

import {Button} from '../Button';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '../Popover';

export function PopoverDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('Balloon name');
  const [editName, setEditName] = useState(name);

  return (
    <div className="flex items-center gap-2 h-14">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            className="bg-transparent dark:bg-transparent data-[state=open]:bg-gray-100/50 dark:data-[state=open]:bg-gray-600 flex gap-2 items-center"
            onClick={() => setIsOpen((v) => !v)}
            aria-label={`${name} - Edit`}
          >
            <span className="text-lg font-bold">{name}</span>
            <Edit size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="rounded-lg bg-white dark:text-black bg-clip-padding border border-gray-900/10 shadow-lg shadow-blue-900/10 p-4">
          <h2 className="text-lg font-bold mb-2">Edit name</h2>
          <div className="flex items-center gap-2">
            <input
              className="py-1 px-2 border border-gray-600 dark:bg-white focus:border-blue-500 outline-none rounded"
              value={editName}
              onChange={(event) =>
                setEditName(event.target.value)
              }
              maxLength={20}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setName(editName);
                  setIsOpen(false);
                }
              }}
            />
            <PopoverClose
              aria-label="Confirm"
              className="py-1 text-sm"
              onClick={() => {
                setName(editName);
              }}
            >
              <Check />
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
