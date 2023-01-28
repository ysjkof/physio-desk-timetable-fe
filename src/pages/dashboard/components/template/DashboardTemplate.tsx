import { ReactNode, useEffect, useRef, useState } from 'react';
import { useMediaQuery, useWindowSize } from '../../../../hooks';
import { BarBottomLeft } from '../../../../svgs';
import DocsSidebarModal from '../../../docs/components/molecules/DocsSidebarModal';

interface DashboardTemplateProps {
  sidebar: ReactNode;
  breadcrumb: ReactNode;
  clinicSelector: ReactNode;
  children: ReactNode;
}

export default function DashboardTemplate({
  sidebar,
  breadcrumb,
  clinicSelector,
  children,
}: DashboardTemplateProps) {
  const { height, changeHeight } = useWindowSize(true);
  const breadcrumbRef = useRef<HTMLDivElement>(null);

  const [isDesktop] = useMediaQuery({ minWidth: '640' });

  const [isOpen, setOpen] = useState(false);
  const toggleAside = () => {
    setOpen((prev) => !prev);
  };
  useEffect(() => {
    if (!breadcrumbRef.current) return;
    changeHeight(breadcrumbRef.current.clientHeight);
  }, []);

  return (
    <div className="grid h-full  grid-cols-[50px,140px,1fr] grid-rows-[2rem,1fr] md:grid-cols-[150px,1fr]">
      <div className="flex items-center justify-center border-r border-b md:hidden">
        <BarBottomLeft onClick={toggleAside} />
      </div>
      <div className="col-start-2 row-span-1 row-start-1 md:col-start-1">
        {clinicSelector}
      </div>
      <div
        className="col-start-3 whitespace-nowrap border-b border-l p-2 md:col-start-2"
        ref={breadcrumbRef}
      >
        {breadcrumb}
      </div>
      {isDesktop && (
        <div className="md:col-start-1 md:row-span-2 md:row-start-2">
          {sidebar}
        </div>
      )}
      {!isDesktop && isOpen && (
        <DocsSidebarModal toggleAside={toggleAside}>{sidebar}</DocsSidebarModal>
      )}
      <div
        className="dashboard-contents relative col-span-3 col-start-1 row-start-2 overflow-y-scroll border-l md:col-span-1 md:col-start-2"
        style={{ ...(height && { height }) }}
      >
        {children}
      </div>
    </div>
  );
}
