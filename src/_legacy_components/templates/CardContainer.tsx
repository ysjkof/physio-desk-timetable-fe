import type { PropsWithChildren } from 'react';

export default function CardContainer({ children }: PropsWithChildren) {
  return <div className="flex flex-wrap gap-y-10 gap-x-10">{children}</div>;
}
