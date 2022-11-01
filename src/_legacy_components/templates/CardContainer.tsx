import { ChildrenProps } from '../../types/common.types';

export default function CardContainer({ children }: ChildrenProps) {
  return <div className="flex flex-wrap gap-y-10 gap-x-10">{children}</div>;
}
