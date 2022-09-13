import { ReactNode, useEffect, useRef, useState } from 'react';

interface DashboardTemplateProps {
  breadcrumb: ReactNode;
  nav: ReactNode;
  children: ReactNode;
}
export const DashboardTemplate = ({
  breadcrumb,
  nav,
  children,
}: DashboardTemplateProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | false = false;
    function handleTableHeight() {
      const headerElement = document.getElementById('header');
      const headlessHeight = window.innerHeight - headerElement?.offsetHeight!;
      const breadcrumbHight = ref.current?.offsetHeight!;
      const dashboardMainHeight = headlessHeight - breadcrumbHight;

      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setHeight(dashboardMainHeight);
      }, 200);
    }
    handleTableHeight();
    window.addEventListener('resize', handleTableHeight);
    return () => window.removeEventListener('resize', handleTableHeight);
  }, []);

  return (
    <div className="grid h-full grid-cols-[150px,1fr] grid-rows-[2rem,1fr]">
      <div className="col-start-1 row-span-2 row-start-1">{nav}</div>
      <div className="col-start-2 border-b border-l p-2" ref={ref}>
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
};
