import { useReactiveVar } from "@apollo/client";
import { ReactNode } from "react";
import { viewOptionsVar } from "../../../store";
import { ONE_DAY } from "../../../variables";

interface TableLoopLayoutProps {
  userLength: number;
  children: ReactNode;
  isDivide?: boolean;
  isActiveBorderTop?: boolean;
}
export function TableLoopLayout({
  userLength,
  children,
  isDivide = true,
  isActiveBorderTop = false,
}: TableLoopLayoutProps) {
  const viewOptions = useReactiveVar(viewOptionsVar);

  return (
    <div
      className={`grid h-5 w-full ${isDivide ? "divide-x divide-black" : ""} ${
        isActiveBorderTop ? "border-t border-white" : ""
      }`}
      style={
        viewOptions.periodToView === ONE_DAY
          ? {
              gridTemplateColumns: `repeat(1, minmax(${
                userLength * 6
              }rem,1fr))`,
            }
          : {
              gridTemplateColumns: `repeat(7, minmax(${userLength * 6}rem,1fr)`,
            }
      }
    >
      {children}
    </div>
  );
}
