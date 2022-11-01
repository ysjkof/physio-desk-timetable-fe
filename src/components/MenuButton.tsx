import { cls } from '../utils/utils';

interface MenuButtonProps {
  icon?: React.ReactNode;
  isActivated?: boolean;
  color?: string;
  backgroundColor?: string;
  label: string;
  onClick: () => void;
}
export function MenuButton({
  icon,
  isActivated,
  color,
  backgroundColor,
  label,
  onClick,
}: MenuButtonProps) {
  return (
    <div
      className={cls(
        'flex h-8 w-fit items-center gap-2 rounded-sm border border-gray-500 px-2',
        isActivated ? 'bg-gray-500 text-white' : ''
      )}
      onClick={onClick}
      style={{
        ...(isActivated && {
          backgroundColor,
          color,
        }),
      }}
    >
      {icon && icon}
      {label}
    </div>
  );
}
