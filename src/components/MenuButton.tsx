import { forwardRef } from 'react';
import { cls } from '../utils/utils';

interface MenuButtonProps {
  icon?: React.ReactNode;
  isActivated?: boolean;
  color?: string;
  backgroundColor?: string;
  label: string;
  onClick: () => void;
}
export const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(
  function MenuButton({
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
          'flex h-8 w-fit select-none items-center gap-2 whitespace-nowrap rounded-sm border border-gray-500 px-2',
          isActivated ? 'bg-gray-500 text-white' : ''
        )}
        onClick={onClick}
        style={{
          ...(backgroundColor && {
            backgroundColor,
            borderColor: backgroundColor,
            color,
          }),
        }}
      >
        {icon && icon}
        {label}
      </div>
    );
  }
);
