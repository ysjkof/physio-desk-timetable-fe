import { ChildrenProps } from '../../../../types/type';

export default function P({ children }: ChildrenProps) {
  return <p className="mb-4">{children}</p>;
}
