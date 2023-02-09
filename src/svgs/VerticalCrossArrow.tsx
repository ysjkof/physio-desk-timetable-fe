import { SVG } from '../types/common.types';
import { cls } from '../utils/common.utils';

/**
 * by JH
 */
const VerticalCrossArrow = ({ iconSize = 'MD', ...args }: SVG) => {
  return (
    <svg
      width="13"
      height="11"
      viewBox="0 0 13 11"
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
        d="M6.5 7.5L9 10L11.5 7.5"
        stroke="#262850"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 10V1"
        stroke="#262850"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 3.5L3.5 1L1 3.5"
        stroke="#262850"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 1L3.5 10"
        stroke="#262850"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default VerticalCrossArrow;
