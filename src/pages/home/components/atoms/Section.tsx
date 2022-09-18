import { ChildrenProps, ClassNameProps } from '../../../../types/type';
import { cls } from '../../../../utils/utils';

interface SectionProps extends ChildrenProps, ClassNameProps {
  bgColor?: 'white';
  widthFull?: boolean;
}

export default function Section({
  widthFull,
  children,
  className,
}: SectionProps) {
  return (
    <section className={cls('mb-16', className || '')}>
      {widthFull ? (
        children
      ) : (
        <div className="mx-auto max-w-2xl px-6">{children}</div>
      )}
    </section>
  );
}
