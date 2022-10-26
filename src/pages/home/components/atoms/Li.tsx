import { ChildrenProps, ClassNameProps } from '../../../../types/common.types';
import { cls } from '../../../../utils/utils';

interface LiProps extends ChildrenProps, ClassNameProps {}

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
