import type { PropsWithChildren } from 'react';
import { cls } from '../../../../utils/commonUtils';
import type { ClassNameProps } from '../../../../types/commonTypes';

interface PProps extends PropsWithChildren, ClassNameProps {}

export default function P({ children, className }: PProps) {
  return <p className={cls('mb-4', className || '')}>{children}</p>;
}
