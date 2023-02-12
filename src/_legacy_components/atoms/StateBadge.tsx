import type { HTMLAttributes, PropsWithChildren } from 'react';
import { cls, StayingState } from '../../utils/common.utils';

interface StateBadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    PropsWithChildren {
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
        state === '탈퇴' ? 'badge-gray' : '',
        state === '수락대기' ? 'badge-red ' : '',
        state === '직원' || state === '관리자' ? 'badge-green' : '',
        args.className || ''
      )}
    >
      {state || children}
    </span>
  );
}
