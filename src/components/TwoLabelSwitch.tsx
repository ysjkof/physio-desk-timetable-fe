import { cls } from '../utils/utils';

type Label = string;
interface SwitchProps {
  isActivated: boolean;
  labels: [Label, Label];
  onClick: () => void;
}
interface SwitchLabelType {
  label: Label;
}

function SwitchLabel({ label }: SwitchLabelType) {
  return (
    <button
      className={cls(
        'pointer-events-none z-10 flex w-1/2 items-center justify-center whitespace-nowrap px-4'
      )}
      type="button"
    >
      {label}
    </button>
  );
}
function MovingBox({ isActivated }: Pick<SwitchProps, 'isActivated'>) {
  return (
    <div
      className={cls(
        'absolute inline-flex h-full w-full cursor-pointer items-center bg-gray-200 transition-colors duration-200 ease-in-out'
      )}
    >
      <span
        aria-hidden="true"
        className={cls(
          'pointer-events-none h-full w-1/2 transform rounded-sm bg-white transition duration-200 ease-in-out',
          isActivated ? 'translate-x-full' : 'translate-x-0'
        )}
      />
    </div>
  );
}

export function TwoLabelSwitch({ isActivated, labels, onClick }: SwitchProps) {
  return (
    <div
      className="relative flex h-8 w-fit cursor-pointer items-center justify-center rounded-sm border border-gray-200 bg-gray-200"
      onClick={onClick}
    >
      {labels.map((label) => (
        <SwitchLabel label={label} />
      ))}
      <MovingBox isActivated={isActivated} />
    </div>
  );
}
