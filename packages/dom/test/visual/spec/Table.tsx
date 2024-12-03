import {useFloating} from '@floating-ui/react-dom';
import {useLayoutEffect, useState} from 'react';

import {Controls} from '../utils/Controls';

type Node = 'table' | 'td' | 'th';
const NODES: Node[] = ['table', 'td', 'th'];
const BOOLS = [true, false];

export function Table() {
  const [sameParent, setSameParent] = useState(false);
  const [node, setNode] = useState<Node>('td');
  const {x, y, refs, strategy, update} = useFloating();

  useLayoutEffect(update, [update, node, sameParent]);

  const floatingJsx = (
    <div
      ref={refs.setFloating}
      className="floating"
      style={{
        position: strategy,
        top: y ?? '',
        left: x ?? '',
      }}
    >
      Floating
    </div>
  );

  return (
    <>
      <h1>Table</h1>
      <p>
        The floating element should be correctly positioned when the reference
        or ancestor is a table element.
      </p>
      <div className="container">
        <table ref={node === 'table' ? refs.setReference : undefined}>
          <thead>
            <tr ref={node === 'th' ? refs.setReference : undefined}>
              <th>Reference th</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td ref={node === 'td' ? refs.setReference : undefined}>
                Reference td
                {sameParent ? floatingJsx : null}
              </td>
            </tr>
          </tbody>
        </table>

        {sameParent ? null : floatingJsx}
      </div>

      <h2>Inside table</h2>
      <Controls>
        {BOOLS.map((bool) => (
          <button
            key={String(bool)}
            data-testid={`inside-${bool}`}
            onClick={() => setSameParent(bool)}
            style={{
              backgroundColor: sameParent === bool ? 'black' : '',
            }}
          >
            {String(bool)}
          </button>
        ))}
      </Controls>

      <h2>Reference node</h2>
      <Controls>
        {NODES.map((localNode) => (
          <button
            key={String(localNode)}
            data-testid={`reference-${localNode}`}
            onClick={() => setNode(localNode)}
            style={{
              backgroundColor: node === localNode ? 'black' : '',
            }}
          >
            {localNode}
          </button>
        ))}
      </Controls>
    </>
  );
}
