import {
  useFloating,
  FloatingTree,
  FloatingNode,
  useFloatingNodeId,
  FloatingPortal,
  FloatingOverlay,
  FloatingFocusManager,
  useDismiss,
  useInteractions,
} from '@floating-ui/react';
import {useState} from 'react';

function NestedModal({open, onClose, children, portalContainerId = ''}) {
  const nodeId = useFloatingNodeId();

  const {refs, context} = useFloating({
    nodeId,
    open,
    onOpenChange: (open, event, reason) => {
      if (!open) {
        onClose();
      }
    },
  });

  const dismiss = useDismiss(context, {bubbles: false});

  const {getFloatingProps} = useInteractions([dismiss]);

  return (
    <FloatingNode id={nodeId}>
      {open && (
        <FloatingPortal id={portalContainerId}>
          <FloatingOverlay lockScroll>
            <div
              style={{
                minWidth: '100%',
                minHeight: '100%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FloatingFocusManager context={context}>
                <div
                  ref={refs.setFloating}
                  style={{
                    background: 'white',
                    padding: '60px',
                    borderRadius: '6px',
                    position: 'fixed',
                    border: '1px solid #000',
                  }}
                  {...getFloatingProps()}
                >
                  {children}
                </div>
              </FloatingFocusManager>
            </div>
          </FloatingOverlay>
        </FloatingPortal>
      )}
    </FloatingNode>
  );
}

export function New() {
  const [firstModalShow, setFirstModalShow] = useState(false);
  const [secondModalShow, setSecondModalShow] = useState(false);

  const [customFirstModalShow, setCustomFirstModalShow] = useState(false);
  const [customSecondModalShow, setCustomSecondModalShow] = useState(false);

  return (
    <div className="main">
      <h3>Example with default body portal</h3>
      <button onClick={() => setFirstModalShow(true)}>Open first modal</button>
      <FloatingTree>
        <NestedModal
          open={firstModalShow}
          onClose={() => setFirstModalShow(false)}
        >
          <button onClick={() => setSecondModalShow(true)}>
            Open second modal
          </button>
        </NestedModal>
        <NestedModal
          open={secondModalShow}
          onClose={() => setSecondModalShow(false)}
        >
          Hello 2
        </NestedModal>
      </FloatingTree>

      <br />
      <br />

      <h3>Example with custom portal (bug)</h3>
      <button onClick={() => setCustomFirstModalShow(true)}>
        Open first modal
      </button>
      <FloatingTree>
        <NestedModal
          open={customFirstModalShow}
          onClose={() => setCustomFirstModalShow(false)}
          portalContainerId="custom-portal"
        >
          <button onClick={() => setCustomSecondModalShow(true)}>
            Open second modal
          </button>
        </NestedModal>
        <NestedModal
          open={customSecondModalShow}
          onClose={() => setCustomSecondModalShow(false)}
          portalContainerId="custom-portal"
        >
          Second modal
        </NestedModal>
      </FloatingTree>
      <div id="custom-portal" />
    </div>
  );
}
