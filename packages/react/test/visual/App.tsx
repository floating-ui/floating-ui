import {StrictMode} from 'react';
import {
  BrowserRouter,
  Link,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import {Main as Arrow} from './components/Arrow';
import {Main as Autocomplete} from './components/Autocomplete';
import {Main as ComplexGrid} from './components/ComplexGrid';
import {Main as Drawer} from './components/Drawer';
import {Main as EmojiPicker} from './components/EmojiPicker';
import {Main as Grid} from './components/Grid';
import {Main as MacSelect} from './components/MacSelect';
import {Main as Menu} from './components/Menu';
import {Main as MenuOrientation} from './components/MenuOrientation';
import {Main as Menubar} from './components/Menubar';
import {Main as MenuVirtual} from './components/MenuVirtual';
import {Main as Navigation} from './components/Navigation';
import {New} from './components/New';
import {Main as Omnibox} from './components/Omnibox';
import {Main as Popover} from './components/Popover';
import {Main as Select} from './components/Select';
import {Main as Tooltip} from './components/Tooltip';

const ROUTES = [
  {path: 'tooltip', component: Tooltip},
  {path: 'popover', component: Popover},
  {path: 'menu', component: Menu},
  {path: 'menu-orientation', component: MenuOrientation},
  {path: 'select', component: Select},
  {path: 'mac-select', component: MacSelect},
  {path: 'emoji-picker', component: EmojiPicker},
  {path: 'autocomplete', component: Autocomplete},
  {path: 'navigation', component: Navigation},
  {path: 'drawer', component: Drawer},
  {path: 'arrow', component: Arrow},
  {path: 'menubar', component: Menubar},
  {path: 'menu-virtual', component: MenuVirtual},
  {path: 'omnibox', component: Omnibox},
  {path: 'grid', component: Grid},
  {path: 'complex-grid', component: ComplexGrid},
];

function Index() {
  const {pathname} = useLocation();

  return (
    <div>
      <main className="p-12 lg:ml-64">
        {pathname === '/' && (
          <>
            <h1>Floating UI Testing Grounds</h1>
            <p>
              Welcome! On the left is a navigation bar to browse through
              different testing files.
            </p>
          </>
        )}
        <Outlet />
      </main>
      <nav className="fixed top-0 left-0 flex-col hidden h-full p-8 overflow-y-auto bg-slate-100 lg:w-64 lg:flex">
        <div className="">
          <Link to="/" className="block mb-4 text-2xl font-bold">
            Tests
          </Link>
          <Link
            to="/new"
            className="inline-block px-4 py-2 mb-4 font-bold text-white bg-blue-500 rounded"
          >
            New
          </Link>
        </div>
        <ul className="flex flex-col text-lg capitalize">
          {ROUTES.map(({path}) => (
            <Link
              key={path}
              to={`/${path}`}
              className="py-1"
              style={{
                color: pathname === `/${path}` ? 'black' : '',
                fontWeight: pathname === `/${path}` ? 'bold' : '',
              }}
            >
              {path.replace('-', ' ')}
            </Link>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export function App() {
  return (
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />}>
            <Route path="/new" element={<New />} />
            {ROUTES.map(({path, component: Component}) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
}
