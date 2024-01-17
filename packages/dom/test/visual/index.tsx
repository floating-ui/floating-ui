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

import {Arrow} from './spec/Arrow';
import {AutoPlacement} from './spec/AutoPlacement';
import {AutoUpdate} from './spec/AutoUpdate';
import {Border} from './spec/Border';
import {ContainingBlock} from './spec/ContainingBlock';
import {DecimalSize} from './spec/DecimalSize';
import {Flip} from './spec/Flip';
import {Hide} from './spec/Hide';
import {IFrame} from './spec/IFrame';
import {Inline} from './spec/Inline';
import {Offset} from './spec/Offset';
import {Perf} from './spec/Perf';
import {Placement} from './spec/Placement';
import {Relative} from './spec/Relative';
import {Scroll} from './spec/Scroll';
import {Scrollbars} from './spec/Scrollbars';
import {ShadowDOM} from './spec/ShadowDOM';
import {Shift} from './spec/Shift';
import {Size} from './spec/Size';
import {Table} from './spec/Table';
import {Transform} from './spec/Transform';
import {VirtualElement} from './spec/VirtualElement';
import {New} from './utils/New';
import {TopLayer} from './spec/TopLayer';

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
  {path: 'AutoUpdate', component: AutoUpdate},
  {path: 'shadow-DOM', component: ShadowDOM},
  {path: 'containing-block', component: ContainingBlock},
  {path: 'virtual-element', component: VirtualElement},
  {path: 'perf', component: Perf},
  {path: 'iframe', component: IFrame},
  {path: 'top-layer', component: TopLayer},
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
  </StrictMode>,
);
