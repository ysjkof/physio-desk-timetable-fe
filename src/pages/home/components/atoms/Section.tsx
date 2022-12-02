import type { PropsWithChildren } from 'react';
import { cls } from '../../../../utils/common.utils';
import type { ClassNameProps } from '../../../../types/common.types';

interface SectionProps extends PropsWithChildren, ClassNameProps {
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
