import { cls } from '../../../../utils/utils';
import type { PropsWithChildren } from 'react';
import type { ClassNameProps } from '../../../../types/common.types';

export interface HeadingProps extends PropsWithChildren, ClassNameProps {}

export default function H1({ children, ...args }: HeadingProps) {
  return (
    <h1
      {...args}
      className={cls(
        'mx-auto mb-6 w-fit text-4xl  font-bold text-gray-900',
        args.className || ''
      )}
    >
      {children}
    </h1>
  );
}
