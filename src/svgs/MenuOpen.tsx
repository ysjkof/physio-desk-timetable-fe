import type { SVG } from '../types/commonTypes';
import { cls } from '../utils/commonUtils';

/**
 * https://fonts.google.com/icons
 */
const MenuOpen = ({ iconSize = 'MD', ...args }: SVG) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      viewBox="0 96 960 960"
      width="48"
      fill="currentColor"
      {...args}
      className={cls(
        args.className || '',
        iconSize === 'LG' ? 'h-5 w-5' : '',
        iconSize === 'MD' ? 'h-4 w-4' : '',
        iconSize === 'SM' ? 'h-3 w-3' : ''
      )}
    >
      <path d="M120 816v-60h520v60H120Zm678-52L609 575l188-188 43 43-145 145 146 146-43 43ZM120 604v-60h400v60H120Zm0-208v-60h520v60H120Z" />
    </svg>
  );
};

export default MenuOpen;
