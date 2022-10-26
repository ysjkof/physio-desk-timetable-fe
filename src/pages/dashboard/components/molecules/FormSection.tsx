import { ChildrenProps } from '../../../../types/common.types';

export default function FormSection({ children }: ChildrenProps) {
  return <section className="flex h-full justify-center">{children}</section>;
}
