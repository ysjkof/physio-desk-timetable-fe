import { SVG } from '../types/common.types';
import { cls } from '../utils/common.utils';

/**
 * heroicicons.com
 * ChevronLeft > Outline
 */
const ChevronLeft = ({ iconSize, ...args }: SVG) => {
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
        iconSize
          ? iconSize === 'LG'
            ? 'h-5 w-5'
            : iconSize === 'MD'
            ? 'h-4 w-4'
            : 'h-3 w-3'
          : 'h-4 w-4'
      )}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5L8.25 12l7.5-7.5"
      />
    </svg>
  );
};

export default ChevronLeft;
