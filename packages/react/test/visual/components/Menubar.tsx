import {Composite, CompositeItem} from '@floating-ui/react';
import {useRef} from 'react';

import {Menu, MenuItem} from './Menu';

export function Main() {
  const compositeRef = useRef<HTMLDivElement>(null);
  const compositeItemRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <h1 className="text-5xl font-bold mb-8">Menubar</h1>
      <div className="grid place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
        <Composite
          className="grid grid-cols-3"
          cols={3}
          orientation="horizontal"
        >
          {[...Array(9)].map((_, i) => (
            <CompositeItem
              key={i}
              role="menuitem"
              className="focus:bg-gray-200 p-2"
            >
              Item {i + 1}
            </CompositeItem>
          ))}
        </Composite>
      </div>
      <div className="grid place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
        <Composite
          className="flex"
          ref={compositeRef}
          role="menubar"
          orientation="horizontal"
        >
          <CompositeItem role="menuitem" className="focus:bg-gray-200 p-2">
            File
          </CompositeItem>
          <CompositeItem
            role="menuitem"
            ref={compositeItemRef}
            className="focus:bg-gray-200 p-2 inline-block"
            render={(props) => <div {...props} />}
          >
            View
          </CompositeItem>
          <CompositeItem
            role="menuitem"
            className="focus:bg-gray-200 p-2"
            render={
              <Menu label="Edit">
                <MenuItem label=".jpg" />
                <MenuItem label=".png" />
                <MenuItem label=".gif" />
                <Menu label="Submenu">
                  <MenuItem label="Second level" />
                  <Menu label="Open third level">
                    <MenuItem label="Third level" />
                  </Menu>
                </Menu>
              </Menu>
            }
          />
          <CompositeItem
            role="menuitem"
            className="focus:bg-gray-200 p-2"
            render={
              <select>
                <option>Left</option>
                <option>Center</option>
                <option>Right</option>
              </select>
            }
          >
            Align
          </CompositeItem>
        </Composite>
      </div>
    </>
  );
}
