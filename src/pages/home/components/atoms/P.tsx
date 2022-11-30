import { cls } from '../../../../utils/utils';
import type { PropsWithChildren } from 'react';
import type { ClassNameProps } from '../../../../types/common.types';

interface PProps extends PropsWithChildren, ClassNameProps {}

export default function P({ children, className }: PProps) {
  return <p className={cls('mb-4', className || '')}>{children}</p>;
}
