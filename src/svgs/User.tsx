import { SVG } from '../types/commonTypes';
import { cls } from '../utils/commonUtils';

/**
 * by JH
 */
const User = ({ iconSize = 'MD', ...args }: SVG) => {
  return (
    <svg
      width="11"
      height="15"
      viewBox="0 0 11 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      {...args}
      className={cls(
        args.className || '',
        iconSize === 'LG' ? 'h-5 w-5' : '',
        iconSize === 'MD' ? 'h-4 w-4' : '',
        iconSize === 'SM' ? 'h-3 w-3' : ''
      )}
    >
      <circle cx="5.5" cy="4.5" r="3.5" strokeWidth="2" />
      <path
        d="M10 14V14C10 12.3431 8.65685 11 7 11H4C2.34315 11 1 12.3431 1 14V14"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default User;
