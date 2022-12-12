import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cls } from '../utils/common.utils';

interface MenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActivated?: boolean;
  hasBorder?: boolean;
}

const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ isActivated, hasBorder, ...args }, ref) => (
    <button
      type="button"
      {...args}
      className={cls(
        'flex h-8 select-none items-center justify-center gap-2 whitespace-nowrap rounded-sm px-2',
        isActivated ? 'bg-gray-500 text-white' : '',
        hasBorder ? 'border border-gray-500' : '',
        args.className || ''
      )}
      ref={ref}
    >
      {args.children}
    </button>
  )
);

MenuButton.displayName = 'asdMenuButton';

export default MenuButton;
