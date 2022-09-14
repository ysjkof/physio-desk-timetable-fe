import { ChildrenProps } from '../../../types/type';

export default function H1({ children }: ChildrenProps) {
  return <h1 className="mb-6 text-3xl text-gray-900">{children}</h1>;
}
