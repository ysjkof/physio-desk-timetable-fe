import { ChildrenProps, ClassNameProps } from '../../../types/type';
import { cls } from '../../../utils/utils';

interface ListCellProps extends ClassNameProps, ChildrenProps {}

export default function ListCell({ className, children }: ListCellProps) {
  return (
    <div className={cls('flex w-full items-center p-2', className || '')}>
      {children}
    </div>
  );
}
