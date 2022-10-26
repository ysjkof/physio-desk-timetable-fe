import { ChildrenProps, ClassNameProps } from '../../../../types/common.types';
import { cls } from '../../../../utils/utils';

export interface HeadingPoprs extends ChildrenProps, ClassNameProps {}

export default function H1({ children, ...args }: HeadingPoprs) {
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
