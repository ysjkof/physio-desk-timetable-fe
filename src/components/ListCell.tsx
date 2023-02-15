import type { PropsWithChildren } from 'react';
import { cls } from '../utils/commonUtils';
import type { ClassNameProps } from '../types/commonTypes';

interface ListCellProps extends ClassNameProps, PropsWithChildren {}

const ListCell = ({ className, children }: ListCellProps) => {
  return (
    <div className={cls('flex w-full items-center p-2', className || '')}>
      {children}
    </div>
  );
};

export default ListCell;
