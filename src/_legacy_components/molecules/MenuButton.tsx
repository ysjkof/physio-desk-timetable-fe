import { forwardRef, PropsWithChildren } from 'react';
import { cls } from '../../utils/common.utils';

interface BtnMenuProps extends PropsWithChildren {
  enabled?: boolean;
  isWidthFull?: boolean;
  hasBorder?: boolean;
  hasActiveRing?: boolean;
  hasFocus?: boolean;
  thinFont?: boolean;
  isCenter?: boolean;
  onClick?: () => void;
}

export default forwardRef<HTMLButtonElement, BtnMenuProps>(function MenuButton(
  {
    enabled,
    isWidthFull,
    hasBorder,
    hasActiveRing,
    hasFocus,
    thinFont,
    isCenter,
    onClick,
    children,
  },
  ref
) {
  return (
    <button
      className={cls(
        'btn-menu flex items-center gap-1 whitespace-nowrap',
        hasBorder ? 'border-gray-300' : '',
        enabled ? 'font-semibold' : 'opacity-50',
        hasActiveRing ? 'emphasize-ring  border-transparent' : '',
        isWidthFull ? 'w-full' : '',
        thinFont ? 'py-0 text-[0.7rem] font-normal' : '',
        isCenter ? 'mx-auto text-center' : '',
        onClick ? '' : 'pointer-events-none cursor-default hover:bg-inherit',
        hasFocus ? 'focus:emphasize-ring' : ''
      )}
      onClick={onClick}
      ref={ref}
      type="button"
    >
      {children}
    </button>
  );
});
