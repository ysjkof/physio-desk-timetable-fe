import { SVG } from '../types/commonTypes';
import { cls } from '../utils/commonUtils';

/**
 * heroicicons.com
 * ChevronRight > Outline
 */
const ChevronRight = ({ iconSize = 'MD', ...args }: SVG) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...args}
      className={cls(
        args.className || '',
        iconSize === 'LG' ? 'h-5 w-5' : '',
        iconSize === 'MD' ? 'h-4 w-4' : '',
        iconSize === 'SM' ? 'h-3 w-3' : ''
      )}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 4.5l7.5 7.5-7.5 7.5"
      />
    </svg>
  );
};

export default ChevronRight;
