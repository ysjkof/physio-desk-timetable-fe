import { forwardRef, PropsWithChildren } from 'react';
import { cls } from '../utils/common.utils';

interface MenuButtonProps extends PropsWithChildren {
  isActivated?: boolean;
  color?: string;
  backgroundColor?: string;
  onClick: () => void;
}

const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ isActivated, color, backgroundColor, children, onClick }, ref) => (
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
      {children}
    </button>
  )
);

MenuButton.displayName = 'asdMenuButton';

export default MenuButton;
