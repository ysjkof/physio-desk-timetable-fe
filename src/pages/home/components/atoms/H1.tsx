import { HTMLAttributes } from 'react';
import { ChildrenProps } from '../../../../types/type';
import { cls } from '../../../../utils/utils';

interface H1Poprs extends ChildrenProps, HTMLAttributes<HTMLHeadElement> {}
export default function H1({ children, ...args }: H1Poprs) {
  return (
    <h1
      {...args}
      className={cls(
        'mb-6 text-3xl font-medium text-gray-900',
        args.className || ''
      )}
    >
      {children}
    </h1>
  );
}
