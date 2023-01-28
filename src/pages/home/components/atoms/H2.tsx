import { cls } from '../../../../utils/common.utils';
import { HeadingProps } from './H1';

export default function H2({ children, ...args }: HeadingProps) {
  return (
    <h2
      {...args}
      className={cls(
        'mx-auto mb-6 w-fit text-3xl font-medium text-gray-900',
        args.className || ''
      )}
    >
      {children}
    </h2>
  );
}
