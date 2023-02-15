import { SVG } from '../types/commonTypes';
import { cls } from '../utils/commonUtils';

/**
 * heroicicons.com
 * bars-3-bottom-left
 */
const BarBottomLeft = ({ iconSize = 'MD', ...args }: SVG) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      {...args}
      className={cls(
        args.className || '',
        iconSize === 'LG' ? 'h-5 w-5' : '',
        iconSize === 'MD' ? 'h-4 w-4' : '',
        iconSize === 'SM' ? 'h-3 w-3' : ''
      )}
    >
      <path
        fillRule="evenodd"
        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default BarBottomLeft;
