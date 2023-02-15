import { SVG } from '../types/commonTypes';
import { cls } from '../utils/commonUtils';

/**
 * by JH
 */
const BrokenLine = ({ iconSize = 'MD', ...args }: SVG) => {
  return (
    <svg
      width="16"
      height="12"
      viewBox="0 0 16 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      {...args}
      className={cls(
        args.className || '',
        iconSize === 'LG' ? 'h-6 w-6' : '',
        iconSize === 'MD' ? 'h-4 w-4' : '',
        iconSize === 'SM' ? 'h-3 w-3' : ''
      )}
    >
      <path
        d="M1 10L3.5 4.5L7.5 11L12.5 1.5L15 7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BrokenLine;
