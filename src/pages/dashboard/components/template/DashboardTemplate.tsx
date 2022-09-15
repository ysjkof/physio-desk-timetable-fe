import { ReactNode, useEffect, useRef } from 'react';
import useWindowSize from '../../../../hooks/useWindowSize';

interface DashboardTemplateProps {
  breadcrumb: ReactNode;
  nav: ReactNode;
  children: ReactNode;
}
export default function DashboardTemplate({
  breadcrumb,
  nav,
  children,
}: DashboardTemplateProps) {
  const { height, changeMinus } = useWindowSize(true);
  const breadcrumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!breadcrumbRef.current) return;
    changeMinus(breadcrumbRef.current.clientHeight);
  }, []);

  return (
    <div className="grid h-full grid-cols-[150px,1fr] grid-rows-[2rem,1fr]">
      <div className="col-start-1 row-span-2 row-start-1">{nav}</div>
      <div className="col-start-2 border-b border-l p-2" ref={breadcrumbRef}>
        {breadcrumb}
      </div>
      <div
        className="dashboard-contents relative col-start-2 row-start-2 overflow-y-scroll border-l"
        style={{ ...(height && { height }) }}
      >
        {children}
      </div>
    </div>
  );
}
