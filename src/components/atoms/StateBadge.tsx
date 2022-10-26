import { HTMLAttributes } from 'react';
import { ChildrenProps } from '../../types/common.types';
import { cls, StayingState } from '../../utils/utils';

interface StateBadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    ChildrenProps {
  state?: StayingState;
}
export default function StateBadge({
  state,
  children,
  ...args
}: StateBadgeProps) {
  return (
    <span
      {...args}
      className={cls(
        'w-fit whitespace-nowrap',
        state === '탈퇴'
          ? 'badge-gray'
          : state === '승인대기'
          ? 'badge-red '
          : 'badge-green',
        args.className || ''
      )}
    >
      {state || children}
    </span>
  );
}
