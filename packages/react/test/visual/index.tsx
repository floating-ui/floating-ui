import './index.css';

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
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
import {Main as Drawer} from './components/Drawer';
import {Main as EmojiPicker} from './components/EmojiPicker';
import {Main as MacSelect} from './components/MacSelect';
import {Main as Menu} from './components/Menu';
import {Main as Menubar} from './components/Menubar';
import {Main as Navigation} from './components/Navigation';
import {New} from './components/New';
import {Main as Popover} from './components/Popover';
import {Main as Select} from './components/Select';
import {Main as Tooltip} from './components/Tooltip';

const ROUTES = [
  {path: 'tooltip', component: Tooltip},
  {path: 'popover', component: Popover},
  {path: 'menu', component: Menu},
  {path: 'select', component: Select},
  {path: 'mac-select', component: MacSelect},
  {path: 'emoji-picker', component: EmojiPicker},
  {path: 'autocomplete', component: Autocomplete},
  {path: 'navigation', component: Navigation},
  {path: 'drawer', component: Drawer},
  {path: 'arrow', component: Arrow},
  {path: 'menubar', component: Menubar},
];

function App() {
  const {pathname} = useLocation();

  return (
    <div>
      <main className="lg:ml-64 p-12">
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
      <nav className="fixed hidden overflow-y-auto left-0 top-0 h-full p-8 flex-col bg-slate-100 lg:w-64 lg:flex">
        <div className="">
          <Link to="/" className="text-2xl font-bold mb-4 block">
            Tests
          </Link>
          <Link
            to="/new"
            className="bg-blue-500 inline-block rounded px-4 py-2 font-bold text-white mb-4"
          >
            New
          </Link>
        </div>
        <ul className="flex flex-col capitalize text-lg">
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

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/new" element={<New />} />
          {ROUTES.map(({path, component: Component}) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
