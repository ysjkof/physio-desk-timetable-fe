import { cls } from '../../../../utils/commonUtils';
import { HeadingProps } from './H1';

export default function H3({ children, ...args }: HeadingProps) {
  return (
    <h3
      {...args}
      className={cls(
        'mb-6 text-3xl font-light text-gray-900',
        args.className || ''
      )}
    >
      {children}
    </h3>
  );
}
