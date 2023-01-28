import { SVG } from '../types/common.types';
import { cls } from '../utils/common.utils';

/**
 * by JH
 */
const Medicine = ({ iconSize = 'MD', ...args }: SVG) => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...args}
      className={cls(
        args.className || '',
        iconSize === 'LG' ? 'h-6 w-6' : '',
        iconSize === 'MD' ? 'h-4 w-4' : '',
        iconSize === 'SM' ? 'h-3 w-3' : ''
      )}
    >
      <path
        d="M4.90473 5.78797L9.32093 10.2042M6.74807 13.0138L13.0138 6.74807C14.3287 5.43312 14.3287 3.30116 13.0138 1.98621C11.6988 0.671264 9.56688 0.671261 8.25193 1.98621L1.98621 8.25193C0.671262 9.56688 0.671263 11.6988 1.98621 13.0138C3.30116 14.3287 5.43312 14.3287 6.74807 13.0138Z"
        stroke="#8D8DAD"
        strokeWidth="2"
      />
    </svg>
  );
};

export default Medicine;
