import { forwardRef } from 'react';
import { cls } from '../utils/common.utils';

interface MenuButtonProps {
  icon?: React.ReactNode;
  isActivated?: boolean;
  color?: string;
  backgroundColor?: string;
  label: string;
  onClick: () => void;
}
export default forwardRef<HTMLButtonElement, MenuButtonProps>(
  function MenuButton(
    { icon, isActivated, color, backgroundColor, label, onClick },
    ref
  ) {
    return (
      <button
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
        ref={ref}
        type="button"
      >
        {icon && icon}
        {label}
      </button>
    );
  }
);
