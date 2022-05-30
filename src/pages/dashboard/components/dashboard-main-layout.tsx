import { ReactNode } from "react";

interface DashboardMainLayoutProps {
  children: ReactNode;
}

export const DashboardMainLayout = ({ children }: DashboardMainLayoutProps) => {
  return <div className={`space-y-10`}>{children}</div>;
};
