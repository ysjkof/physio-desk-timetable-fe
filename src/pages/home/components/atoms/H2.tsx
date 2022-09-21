import { cls } from '../../../../utils/utils';
import { HeadingPoprs } from './H1';

export default function H2({ children, ...args }: HeadingPoprs) {
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
