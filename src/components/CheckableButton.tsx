import { ReactNode } from 'react';
import { Check } from '../svgs';
import { cls } from '../utils/commonUtils';

interface CheckableButtonProps {
  label: string;
  personalColor: string;
  canSee: boolean;
  onClick: () => void;
  icon?: ReactNode;
}

const CheckableButton = ({
  label,
  personalColor,
  canSee,
  onClick,
  icon,
}: CheckableButtonProps) => {
  return (
    <div
      onClick={onClick}
      onKeyDown={onClick}
      role="button"
      tabIndex={0}
      className={cls(
        'flex h-fit select-none items-center gap-2 whitespace-nowrap rounded-sm border border-gray-300 px-2 py-0.5 text-gray-300',
        canSee ? 'text-white' : 'bg-white'
      )}
      style={{
        ...(canSee && { color: personalColor, borderColor: personalColor }),
      }}
    >
      {icon || (
        <Check
          className={cls('rounded-sm bg-gray-300 text-white')}
          iconSize="SM"
          style={{
            ...(canSee && {
              backgroundColor: personalColor,
            }),
          }}
        />
      )}
      {label}
    </div>
  );
};

export default CheckableButton;
