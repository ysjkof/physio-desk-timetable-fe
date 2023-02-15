import { SVG } from '../types/commonTypes';
import { cls } from '../utils/commonUtils';

/**
 * by JH
 */
const Heart = ({ iconSize = 'MD', ...args }: SVG) => {
  return (
    <svg
      width="15"
      height="13"
      viewBox="0 0 15 13"
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
        d="M7.70609 2.38784C7.59772 2.51002 7.40228 2.51002 7.29391 2.38784C5.79802 0.701376 3.5353 0.551921 2.11522 1.93947C0.628259 3.39237 0.628259 5.74799 2.11522 7.20089L6.69228 11.6731C7.13837 12.109 7.86163 12.109 8.30772 11.6731L12.8848 7.20089C14.3717 5.74799 14.3717 3.39237 12.8848 1.93947C11.4647 0.551921 9.20198 0.701376 7.70609 2.38784Z"
        strokeWidth="2"
      />
    </svg>
  );
};

export default Heart;
