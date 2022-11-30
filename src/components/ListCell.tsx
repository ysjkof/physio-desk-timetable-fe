import { cls } from '../utils/utils';
import type { PropsWithChildren } from 'react';
import type { ClassNameProps } from '../types/common.types';

interface ListCellProps extends ClassNameProps, PropsWithChildren {}

export default function ListCell({ className, children }: ListCellProps) {
  return (
    <div className={cls('flex w-full items-center p-2', className || '')}>
      {children}
    </div>
  );
}
