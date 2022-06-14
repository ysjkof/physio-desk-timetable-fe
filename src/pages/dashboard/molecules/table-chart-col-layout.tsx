import { ReactNode } from "react";

interface TableChartColLayoutProps {
  children: ReactNode;
}
export const TableChartColLayout = ({ children }: TableChartColLayoutProps) => {
  return <div className="TABLE_CHART_COL_LAYOUT flex px-4">{children}</div>;
};
