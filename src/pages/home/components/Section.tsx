import { HtmlHTMLAttributes } from 'react';
import { ChildrenProps } from '../../../types/type';
import { cls } from '../../../utils/utils';

interface SectionProps
  extends ChildrenProps,
    HtmlHTMLAttributes<HTMLDivElement> {
  bgColor?: 'white';
}
export default function Section({ children, ...args }: SectionProps) {
  return (
    <section {...args} className={cls('pt-14 pb-16', args.className || '')}>
      <div className="mx-auto max-w-2xl px-6">{children}</div>
    </section>
  );
}
