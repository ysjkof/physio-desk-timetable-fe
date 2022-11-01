import Check from '../svgs/Check';
import { cls } from '../utils/utils';

export function CheckableButton({
  label,
  color,
  isActivated,
  onClick,
}: {
  label: string;
  color: string;
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
        ...(isActivated && { backgroundColor: color }),
      }}
    >
      <Check
        className={cls(
          'h-[0.75rem] w-[0.75rem] rounded-sm',
          isActivated ? 'bg-white' : 'bg-gray-500 text-white'
        )}
        style={{
          ...(isActivated && { color }),
        }}
      />
      {label}
    </div>
  );
}
