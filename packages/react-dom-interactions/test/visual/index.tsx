import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {
  BrowserRouter,
  Link,
  Routes,
  Route,
  Outlet,
  useLocation,
} from 'react-router-dom';
import './index.css';
import {Main as Tooltip} from './components/Tooltip';
import {Main as Popover} from './components/Popover';
import {Main as Menu} from './components/Menu';
import {Main as MacSelect} from './components/MacSelect';
import {Main as Grid} from './components/Grid';
import {Main as EmojiPicker} from './components/EmojiPicker';

import {New} from './utils/New';

const ROUTES = [
  {path: 'tooltip', component: Tooltip},
  {path: 'popover', component: Popover},
  {path: 'menu', component: Menu},
  {path: 'mac-select', component: MacSelect},
  {path: 'grid', component: Grid},
  {path: 'emoji-picker', component: EmojiPicker},
];

function App() {
  const {pathname} = useLocation();

  return (
    <div>
      <main>
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
      <nav>
        <div className="nav-top">
          <Link to="/" className="home-button">
            Tests
          </Link>
          <Link to="/new" className="new-button">
            New
          </Link>
        </div>
        <ul>
          {ROUTES.map(({path}) => (
            <Link
              key={path}
              to={`/${path}`}
              className="nav-link"
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
