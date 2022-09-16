import { ChildrenProps } from '../../../../types/type';

export default function Li({ children }: ChildrenProps) {
  return (
    <li className="flex w-full items-center justify-center whitespace-nowrap rounded-lg bg-white py-2 font-medium shadow-md ">
      <span>{children}</span>
    </li>
  );
}
