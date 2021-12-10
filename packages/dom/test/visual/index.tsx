import {render} from 'react-dom';
import {
  BrowserRouter,
  Link,
  Routes,
  Route,
  Outlet,
  useLocation,
} from 'react-router-dom';
import './index.css';
import {Placement} from './spec/Placement';
import {Relative} from './spec/Relative';
import {Transform} from './spec/Transform';
import {Border} from './spec/Border';
import {Scroll} from './spec/Scroll';
import {DecimalSize} from './spec/DecimalSize';
import {Table} from './spec/Table';
import {Scrollbars} from './spec/Scrollbars';
import {Shift} from './spec/Shift';
import {Flip} from './spec/Flip';
import {Size} from './spec/Size';
import {Arrow} from './spec/Arrow';
import {Offset} from './spec/Offset';
import {Hide} from './spec/Hide';
import {AutoPlacement} from './spec/AutoPlacement';
import {Inline} from './spec/Inline';
import {New} from './utils/New';

const ROUTES = [
  {path: 'placement', component: Placement},
  {path: 'relative', component: Relative},
  {path: 'transform', component: Transform},
  {path: 'border', component: Border},
  {path: 'scroll', component: Scroll},
  {path: 'decimal-size', component: DecimalSize},
  {path: 'table', component: Table},
  {path: 'scrollbars', component: Scrollbars},
  {path: 'shift', component: Shift},
  {path: 'flip', component: Flip},
  {path: 'size', component: Size},
  {path: 'arrow', component: Arrow},
  {path: 'offset', component: Offset},
  {path: 'hide', component: Hide},
  {path: 'autoPlacement', component: AutoPlacement},
  {path: 'inline', component: Inline},
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
              different testing files. These files, and the control buttons, are
              used by Playwright to take screenshots of the page for visual
              snapshot testing.
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

render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/new" element={<New />} />
        {ROUTES.map(({path, component: Component}) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);
