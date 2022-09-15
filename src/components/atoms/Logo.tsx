import { HTMLAttributes } from 'react';
import { cls } from '../../utils/utils';

interface LogoProps extends HTMLAttributes<HTMLHeadElement> {
  size?: 1 | 2;
}

export default function Logo({ size = 1, ...args }: LogoProps) {
  return (
    <h1
      {...args}
      className={cls(
        'cursor-pointer whitespace-nowrap text-xl font-bold',
        size === 1 ? 'sm:text-2xl' : 'sm:text-6xl',
        args.className || ''
      )}
    >
      무울시간표
    </h1>
  );
}
