import { ChildrenProps } from '../../../types/type';

export default function Li({ children }: ChildrenProps) {
  return (
    <li className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-white px-6 py-2 font-medium shadow-md">
      <span>{children}</span>
    </li>
  );
}
