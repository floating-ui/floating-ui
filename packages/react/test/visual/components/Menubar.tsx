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
        <Composite ref={compositeRef} role="menubar" orientation="horizontal">
          <CompositeItem className="focus:bg-gray-200 p-2">File</CompositeItem>
          <CompositeItem
            ref={compositeItemRef}
            className="focus:bg-gray-200 p-2 inline-block"
            render={(props) => <div {...props} />}
          >
            View
          </CompositeItem>
          <CompositeItem
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
