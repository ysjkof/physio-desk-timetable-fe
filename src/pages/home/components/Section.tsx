import { ChildrenProps } from '../../../types/type';
import { cls } from '../../../utils/utils';

interface SectionProps extends ChildrenProps {
  bgColor?: 'white';
}
export default function Section({ children, bgColor }: SectionProps) {
  return (
    <div
      className={cls(
        'pt-6 pb-16',
        bgColor === 'white' ? 'bg-white' : 'bg-stone-200'
      )}
    >
      <div className="mx-auto max-w-2xl px-6">{children}</div>
    </div>
  );
}
