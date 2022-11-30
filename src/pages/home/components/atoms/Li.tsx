import { cls } from '../../../../utils/common.utils';
import type { PropsWithChildren } from 'react';
import type { ClassNameProps } from '../../../../types/common.types';

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
