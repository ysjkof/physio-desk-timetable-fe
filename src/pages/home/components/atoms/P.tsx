import { ChildrenProps, ClassNameProps } from '../../../../types/type';
import { cls } from '../../../../utils/utils';

interface PProps extends ChildrenProps, ClassNameProps {}

export default function P({ children, className }: PProps) {
  return <p className={cls('mb-4', className || '')}>{children}</p>;
}
