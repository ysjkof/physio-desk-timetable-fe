import { cls } from '../../../../utils/common.utils';
import type { PropsWithChildren } from 'react';
import type { ClassNameProps } from '../../../../types/common.types';

interface SectionProps extends PropsWithChildren, ClassNameProps {
  bgColor?: 'white';
  widthFull?: boolean;
}

export default function Section({
  widthFull,
  children,
  className,
}: SectionProps) {
  return (
    <section className={cls('mb-32', className || '')}>
      {widthFull ? (
        children
      ) : (
        <div className="mx-auto max-w-2xl px-6">{children}</div>
      )}
    </section>
  );
}
