import { SVG } from '../types/common.types';
import { cls } from '../utils/common.utils';

/**
 * heroicicons.com
 * EllipsisVertical > Outline
 */
const EllipsisVertical = ({ iconSize, ...args }: SVG) => {
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
        d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
      />
    </svg>
  );
};

export default EllipsisVertical;
