import { ReactNode } from 'react';
import { Check } from '../svgs';
import { cls } from '../utils/commonUtils';

interface CheckableButtonProps {
  label: string;
  personalColor: string;
  canSee: boolean;
  hasBorder?: boolean;
  onClick: () => void;
  icon?: ReactNode;
}

const CheckableButton = ({
  label,
  personalColor,
  canSee,
  hasBorder = true,
  onClick,
  icon,
}: CheckableButtonProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={cls(
        'flex h-fit select-none items-center gap-2 whitespace-nowrap rounded-sm px-2 py-0.5 text-gray-300',
        hasBorder ? 'border border-gray-300' : '',
        canSee ? 'text-white' : 'bg-white'
      )}
      style={{
        ...(canSee && { color: personalColor, borderColor: personalColor }),
      }}
    >
      {icon || (
        <Check
          className="h-4 w-4 rounded-sm bg-gray-300 text-white"
          style={{
            ...(canSee && {
              backgroundColor: personalColor,
            }),
          }}
        />
      )}
      {label}
    </button>
  );
};

export default CheckableButton;
