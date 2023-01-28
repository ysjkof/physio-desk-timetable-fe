import type { PropsWithChildren } from 'react';
import { useWindowSize } from '../../../../hooks';

export default function HomeTemplate({ children }: PropsWithChildren) {
  const { height } = useWindowSize(true);
  return (
    <div className="h-full overflow-y-scroll text-base" style={{ height }}>
      {children}
    </div>
  );
}
