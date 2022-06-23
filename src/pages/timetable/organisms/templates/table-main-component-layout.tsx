import { ReactNode } from "react";

interface TableMainComponentLayoutProps {
  componentName?: string;
  children: ReactNode;
  isLabel?: boolean;
  isTitle?: boolean;
}

export function TableMainComponentLayout({
  componentName,
  children,
  isLabel = false,
  isTitle = false,
}: TableMainComponentLayoutProps) {
  return (
    <div
      className={`${componentName ? componentName : ""} absolute h-full ${
        isLabel ? "bg-white" : "w-full pl-9"
      } ${isTitle ? "" : "pt-[50px]"}`}
    >
      {children}
    </div>
  );
}
