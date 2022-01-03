export default function Code({children, ...props}) {
  return (
    <pre>
      <code data-theme={props['data-theme']}>{children}</code>
    </pre>
  );
}
