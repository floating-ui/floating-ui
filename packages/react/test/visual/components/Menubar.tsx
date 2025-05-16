import {Composite, CompositeItem} from '@floating-ui/react';

import {Menu, MenuItem} from './Menu';

export function MenuGrid() {
  return (
    <>
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
    </>
  );
}

export function Menubar() {
  return (
    <div className="grid place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
      <Composite className="flex" role="menubar" orientation="horizontal">
        <CompositeItem
          role="menuitem"
          className="focus:bg-gray-200 p-2"
          render={
            <Menu label="File" openOnFocus>
              <MenuItem label="Open" />
              <MenuItem label="Save" />
              <MenuItem label="Close" />
            </Menu>
          }
        />
        <CompositeItem
          role="menuitem"
          className="focus:bg-gray-200 p-2"
          render={
            <Menu label="Edit" openOnFocus>
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
  );
}

export function Main() {
  return (
    <>
      <h1 className="text-5xl font-bold mb-8">Menubar</h1>
      <MenuGrid />
      <Menubar />
    </>
  );
}
