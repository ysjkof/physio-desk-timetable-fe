import { cls } from '../utils/commonUtils';

type Label = string;
interface SwitchProps {
  isActive: boolean;
  labels: [Label, Label];
  onClick: () => void;
}

interface SwitchLabelType {
  label: Label;
}

const SwitchLabel = ({ label }: SwitchLabelType) => {
  return (
    <button
      className={cls(
        'z-10 flex w-1/2 items-center justify-center whitespace-nowrap px-4'
      )}
      type="button"
    >
      {label}
    </button>
  );
};

const MovingBox = ({ isActive }: Pick<SwitchProps, 'isActive'>) => {
  return (
    <div
      className={cls(
        'absolute inline-flex h-full w-full cursor-pointer items-center bg-gray-200 transition-colors duration-200 ease-in-out'
      )}
    >
      <span
        aria-hidden="true"
        className={cls(
          'h-full w-1/2 transform rounded-sm bg-white transition duration-200 ease-in-out',
          isActive ? 'translate-x-full' : 'translate-x-0'
        )}
      />
    </div>
  );
};

const TwoLabelSwitch = ({ isActive, labels, onClick }: SwitchProps) => {
  return (
    <div
      className="relative flex h-8 w-fit cursor-pointer select-none items-center justify-center rounded-sm border border-gray-200 bg-gray-200"
      onClick={onClick}
      onKeyDown={onClick}
      role="button"
      tabIndex={0}
    >
      {labels.map((label) => (
        <SwitchLabel key={label} label={label} />
      ))}
      <MovingBox isActive={isActive} />
    </div>
  );
};

export default TwoLabelSwitch;
