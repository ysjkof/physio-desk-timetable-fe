import type { PropsWithChildren } from 'react';
import { cls } from '../../../../utils/commonUtils';
import type { ClassNameProps } from '../../../../types/commonTypes';

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
