type Props = {
  children?: React.ReactNode;
};

export function Controls({children}: Props) {
  return <div className="controls">{children}</div>;
}
