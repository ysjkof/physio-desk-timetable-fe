import Check from '../svgs/Check';
import { cls } from '../utils/common.utils';

interface CheckableButtonProps {
  label: string;
  color: string;
  backgroundColor: string;
  canSee: Boolean;
  onClick: () => void;
}

const CheckableButton = ({
  label,
  color,
  backgroundColor,
  canSee,
  onClick,
}: CheckableButtonProps) => {
  return (
    <div
      onClick={onClick}
      className={cls(
        'flex h-fit select-none items-center gap-2 whitespace-nowrap rounded-sm border border-gray-500 px-2 py-0.5',
        canSee ? 'text-white' : 'bg-white'
      )}
      style={{
        ...(canSee && { color, backgroundColor }),
      }}
    >
      <Check
        className={cls('rounded-sm bg-gray-400 text-white')}
        iconSize="SM"
        style={{
          ...(canSee && {
            color: backgroundColor,
            backgroundColor: color,
          }),
        }}
      />
      {label}
    </div>
  );
};

export default CheckableButton;
