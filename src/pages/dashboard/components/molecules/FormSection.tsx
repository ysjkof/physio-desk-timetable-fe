import type { PropsWithChildren } from 'react';

export default function FormSection({ children }: PropsWithChildren) {
  return <section className="flex h-full justify-center">{children}</section>;
}
