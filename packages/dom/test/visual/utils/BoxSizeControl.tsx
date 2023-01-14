import {boxSizes} from './box-sizes';
import {Controls} from './Controls';

type Props = {
  id: string;
  label: string;
  onChange: (value: string) => void;
  size: string;
};

export function BoxSizeControl({id, label, onChange, size}: Props) {
  return (
    <>
      <h3>{label}</h3>
      <Controls>
        {boxSizes.map((boxSize) => (
          <button
            key={boxSize}
            data-testid={`${id}-${boxSize}`}
            onClick={() => onChange(boxSize)}
            style={{
              backgroundColor: boxSize === size ? 'black' : '',
            }}
          >
            {boxSize}
          </button>
        ))}
      </Controls>
    </>
  );
}
