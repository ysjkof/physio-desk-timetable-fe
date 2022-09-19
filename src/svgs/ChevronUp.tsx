import { SVG } from '../types/type';
import { cls } from '../utils/utils';

/**
 * heroicicons.com
 * chevron-up > mini
 */
export default function ChevronUp({ ...args }: SVG) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      {...args}
      className={cls('h-5 w-5', args.className || '')}
    >
      <path
        fillRule="evenodd"
        d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}
