import { ChildrenProps } from '../../../../types/type';

export default function Li({ children }: ChildrenProps) {
  return (
    <li className="flex w-5/12 items-center justify-center whitespace-nowrap rounded-lg bg-white py-2 font-medium shadow-md sm:w-1/4">
      <span>{children}</span>
    </li>
  );
}
