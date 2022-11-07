import Check from '../svgs/Check';
import { cls } from '../utils/utils';

export function CheckableButton({
  label,
  color,
  backgroundColor,
  isActivated,
  onClick,
}: {
  label: string;
  color: string;
  backgroundColor: string;
  isActivated: Boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cls(
        'flex h-fit select-none items-center gap-2 whitespace-nowrap rounded-sm border border-gray-500 px-2 py-0.5',
        isActivated ? 'text-white' : 'bg-white'
      )}
      style={{
        ...(isActivated && { color, backgroundColor }),
      }}
    >
      <Check
        className={cls('rounded-sm bg-gray-400 text-white')}
        iconSize="SM"
        style={{
          ...(isActivated && {
            color: backgroundColor,
            backgroundColor: color,
          }),
        }}
      />
      {label}
    </div>
  );
}
