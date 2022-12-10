export function DebugSafePolygon({points}: {points: string}) {
  return (
    <svg
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
      }}
    >
      <polygon points={points} style={{fill: 'red', opacity: 0.8}} />
    </svg>
  );
}
