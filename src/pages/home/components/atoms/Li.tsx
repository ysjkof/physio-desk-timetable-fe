import type { PropsWithChildren } from 'react';
import { cls } from '../../../../utils/commonUtils';
import type { ClassNameProps } from '../../../../types/commonTypes';

interface LiProps extends PropsWithChildren, ClassNameProps {}

export default function Li({ children, className }: LiProps) {
  return (
    <li
      className={cls(
        'flex w-[170px] items-center whitespace-nowrap font-medium',
        className || ''
      )}
    >
      {children}
    </li>
  );
}
