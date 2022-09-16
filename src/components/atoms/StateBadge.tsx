import { HTMLAttributes } from 'react';
import { cls, StayingState } from '../../utils/utils';

interface StateBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  state: StayingState;
}
export default function StateBadge({ state, ...args }: StateBadgeProps) {
  return (
    <span
      {...args}
      className={cls(
        'ml-2 w-fit whitespace-nowrap',
        state === '탈퇴'
          ? 'rounded-md bg-gray-100 px-1.5 py-0.5 text-gray-700'
          : state === '승인대기'
          ? 'rounded-md bg-red-100 px-1.5 py-0.5 text-red-700'
          : 'rounded-md bg-green-100 px-1.5 py-0.5 text-green-700',
        args.className || ''
      )}
    >
      {state}
    </span>
  );
}
