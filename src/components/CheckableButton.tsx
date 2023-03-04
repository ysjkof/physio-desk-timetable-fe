import { ReactNode } from 'react';
import { Check } from '../svgs';
import { cls } from '../utils/commonUtils';
import { DEFAULT_COLOR } from '../constants/constants';

interface CheckableButtonProps {
  label: string;
  color: string | undefined;
  checked: boolean;
  hasBorder?: boolean;
  onClick: () => void;
  icon?: ReactNode;
}

const CheckableButton = ({
  label,
  color,
  checked,
  hasBorder = false,
  onClick,
  icon,
}: CheckableButtonProps) => {
  color = color || DEFAULT_COLOR;

  return (
    <button
      onClick={onClick}
      type="button"
      className={cls(
        'flex h-fit select-none items-center gap-2 whitespace-nowrap rounded-sm px-2 py-0.5 text-gray-300',
        hasBorder ? 'border border-gray-300' : '',
        checked ? 'text-white' : 'bg-white'
      )}
      style={{
        ...(checked && { color, borderColor: color }),
      }}
    >
      {icon || (
        <Check
          className="h-4 w-4 rounded-sm bg-gray-300 text-white"
          style={{
            ...(checked && {
              backgroundColor: color,
            }),
          }}
        />
      )}
      {label}
    </button>
  );
};

export default CheckableButton;
