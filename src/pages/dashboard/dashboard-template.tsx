import { ReactNode, useRef } from "react";

interface DashboardTemplateProps {
  breadcrumb: ReactNode;
  nav: ReactNode;
  main: ReactNode;
}
export const DashboardTemplate = ({
  breadcrumb,
  nav,
  main,
}: DashboardTemplateProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const headerElement = document.getElementById("header");
  const headlessHeight = window.innerHeight - headerElement?.offsetHeight!;
  const breadcrumbHight = ref.current?.offsetHeight!;
  const dashboardMainHeight = headlessHeight - breadcrumbHight;
  return (
    <div className="grid grid-cols-[150px,1fr] grid-rows-[2rem,1fr] ">
      <div className="col-start-1 row-span-2 row-start-1">{nav}</div>
      <div className="col-start-2 border-b border-l" ref={ref}>
        {breadcrumb}
      </div>
      <div
        className="dashboard-contents col-start-2 row-start-2 overflow-y-scroll border-l"
        style={{
          ...(dashboardMainHeight && {
            height: dashboardMainHeight,
          }),
        }}
      >
        {main}
      </div>
    </div>
  );
};
