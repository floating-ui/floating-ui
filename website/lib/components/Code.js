export default function Code({children}) {
  return (
    <pre>
      <code>{children}</code>
    </pre>
  );
}

// We use shiki instead of a runtime highlighter to save code and to match
// the better-looking MDX files' highlighting
export const StaticCode = ({placement, middleware}) => (
  <pre className="relative">
    <code>
      <span className="line">
        <span style={{color: '#86E1FC'}}>import</span>
        <span style={{color: '#B4C2F0'}}> </span>
        <span style={{color: '#B4C2F0'}}>{'{'}</span>
        <span style={{color: '#B4C2F0'}}>computePosition</span>
        {middleware && (
          <>
            <span style={{color: '#86E1FC'}}>,</span>
            <span style={{color: '#B4C2F0'}}> </span>
            <span style={{color: '#B4C2F0'}}>{middleware}</span>
          </>
        )}
        <span style={{color: '#B4C2F0'}}>{'}'}</span>
        <span style={{color: '#B4C2F0'}}> </span>
        <span style={{color: '#86E1FC'}}>from</span>
        <span style={{color: '#B4C2F0'}}> </span>
        <span style={{color: '#86E1FC'}}>'</span>
        <span style={{color: '#C3E88D'}}>@floating-ui/dom</span>
        <span style={{color: '#86E1FC'}}>'</span>
        <span style={{color: '#86E1FC'}}>;</span>
      </span>
      <br />
      <span className="line" />
      <br />
      <span className="line">
        <span style={{color: '#C792EA'}}>const</span>
        <span style={{color: '#B4C2F0'}}> </span>
        <span style={{color: '#B4C2F0'}}>button</span>
        <span style={{color: '#B4C2F0'}}> </span>
        <span style={{color: '#86E1FC'}}>=</span>
        <span style={{color: '#B4C2F0'}}> </span>
        <span style={{color: '#FF9488'}}>document</span>
        <span style={{color: '#86E1FC'}}>.</span>
        <span style={{color: '#82AAFF'}}>querySelector</span>
        <span style={{color: '#B4C2F0'}}>(</span>
        <span style={{color: '#86E1FC'}}>'</span>
        <span style={{color: '#C3E88D'}}>#button</span>
        <span style={{color: '#86E1FC'}}>'</span>
        <span style={{color: '#B4C2F0'}}>)</span>
        <span style={{color: '#86E1FC'}}>;</span>
      </span>
      <br />
      <span className="line">
        <span style={{color: '#C792EA'}}>const</span>
        <span style={{color: '#B4C2F0'}}> </span>
        <span style={{color: '#B4C2F0'}}>tooltip</span>
        <span style={{color: '#B4C2F0'}}> </span>
        <span style={{color: '#86E1FC'}}>=</span>
        <span style={{color: '#B4C2F0'}}> </span>
        <span style={{color: '#FF9488'}}>document</span>
        <span style={{color: '#86E1FC'}}>.</span>
        <span style={{color: '#82AAFF'}}>querySelector</span>
        <span style={{color: '#B4C2F0'}}>(</span>
        <span style={{color: '#86E1FC'}}>'</span>
        <span style={{color: '#C3E88D'}}>#tooltip</span>
        <span style={{color: '#86E1FC'}}>'</span>
        <span style={{color: '#B4C2F0'}}>)</span>
        <span style={{color: '#86E1FC'}}>;</span>
      </span>
      <br />
      <span className="line" />
      <br />
      <span className="line">
        <span style={{color: '#C792EA'}}>const</span>
        <span style={{color: '#B4C2F0'}}> </span>
        <span style={{color: '#86E1FC'}}>{'{'}</span>
        <span style={{color: '#B4C2F0'}}>x</span>
        <span style={{color: '#86E1FC'}}>,</span>
        <span style={{color: '#B4C2F0'}}> </span>
        <span style={{color: '#B4C2F0'}}>y</span>
        <span style={{color: '#86E1FC'}}>{'}'}</span>
        <span style={{color: '#B4C2F0'}}> </span>
        <span style={{color: '#86E1FC'}}>=</span>
        <span style={{color: '#B4C2F0'}}> </span>
        <span style={{color: '#86E1FC'}}>await</span>
        <span style={{color: '#B4C2F0'}}> </span>
        <span style={{color: '#82AAFF'}}>computePosition</span>
        <span style={{color: '#B4C2F0'}}>(</span>
        <span style={{color: '#B4C2F0'}}>button</span>
        <span style={{color: '#86E1FC'}}>,</span>
        <span style={{color: '#B4C2F0'}}> tooltip</span>
        <span style={{color: '#86E1FC'}}>,</span>
        <span style={{color: '#B4C2F0'}}> </span>
        <span style={{color: '#B4C2F0'}}>{'{'}</span>
      </span>
      <br />
      <span className="line">
        <span style={{color: '#B4C2F0'}}>{'  '}</span>
        <span style={{color: '#4FD6BE'}}>placement</span>
        <span style={{color: '#86E1FC'}}>:</span>
        <span style={{color: '#A9B8E8'}}> </span>
        <span style={{color: '#86E1FC'}}>'</span>
        <span style={{color: '#C3E88D'}}>{placement}</span>
        <span style={{color: '#86E1FC'}}>'</span>
        <span style={{color: '#86E1FC'}}>,</span>
      </span>
      {middleware && (
        <>
          <br />
          <span className="line">
            <span style={{color: '#B4C2F0'}}>{'  '}</span>
            <span style={{color: '#4FD6BE'}}>middleware</span>
            <span style={{color: '#86E1FC'}}>:</span>
            <span style={{color: '#A9B8E8'}}> </span>
            <span style={{color: '#86E1FC'}}>[</span>
            <span style={{color: '#82AAFF'}}>{middleware}</span>
            <span style={{color: '#B4C2F0'}}>()</span>
            <span style={{color: '#86E1FC'}}>]</span>
          </span>
        </>
      )}
      <br />
      <span className="line">
        <span style={{color: '#B4C2F0'}}>{'}'})</span>
        <span style={{color: '#86E1FC'}}>;</span>
      </span>
      <br />
      <span className="line" />
      <br />
      <span className="line">
        <span style={{color: '#FFC777'}}>Object</span>
        <span style={{color: '#86E1FC'}}>.</span>
        <span style={{color: '#82AAFF'}}>assign</span>
        <span style={{color: '#B4C2F0'}}>(</span>
        <span style={{color: '#FF9488'}}>tooltip</span>
        <span style={{color: '#86E1FC'}}>.</span>
        <span style={{color: '#A9B8E8'}}>style</span>
        <span style={{color: '#86E1FC'}}>,</span>
        <span style={{color: '#B4C2F0'}}> </span>
        <span style={{color: '#B4C2F0'}}>{'{'}</span>
      </span>
      <br />
      <span className="line">
        <span style={{color: '#B4C2F0'}}>{'  '}</span>
        <span style={{color: '#4FD6BE'}}>left</span>
        <span style={{color: '#86E1FC'}}>:</span>
        <span style={{color: '#A9B8E8'}}> </span>
        <span style={{color: '#86E1FC'}}>{'`${'}</span>
        <span style={{color: '#B4C2F0'}}>x</span>
        <span style={{color: '#86E1FC'}}>{'}'}</span>
        <span style={{color: '#C3E88D'}}>px</span>
        <span style={{color: '#86E1FC'}}>{'`'}</span>
        <span style={{color: '#86E1FC'}}>,</span>
      </span>
      <br />
      <span className="line">
        <span style={{color: '#B4C2F0'}}>{'  '}</span>
        <span style={{color: '#4FD6BE'}}>top</span>
        <span style={{color: '#86E1FC'}}>:</span>
        <span style={{color: '#A9B8E8'}}> </span>
        <span style={{color: '#86E1FC'}}>{'`${'}</span>
        <span style={{color: '#B4C2F0'}}>y</span>
        <span style={{color: '#86E1FC'}}>{'}'}</span>
        <span style={{color: '#C3E88D'}}>px</span>
        <span style={{color: '#86E1FC'}}>{'`'}</span>
        <span style={{color: '#86E1FC'}}>,</span>
      </span>
      <br />
      <span className="line">
        <span style={{color: '#B4C2F0'}}>{'}'})</span>
        <span style={{color: '#86E1FC'}}>;</span>
      </span>
    </code>
  </pre>
);
