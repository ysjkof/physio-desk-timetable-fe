import type { PropsWithChildren } from 'react';
import type { ClassNameProps } from '../types/common.types';
import { cls } from '../utils/utils';

interface ListCellProps extends ClassNameProps, PropsWithChildren {}

export const ListCell = ({ className, children }: ListCellProps) => {
  return (
    <div className={cls('flex w-full items-center p-2', className || '')}>
      {children}
    </div>
  );
};
