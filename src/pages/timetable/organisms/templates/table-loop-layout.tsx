import { useReactiveVar } from "@apollo/client";
import { ReactNode } from "react";
import { viewOptionsVar } from "../../../../store";
import { ONE_DAY } from "../../../../variables";

interface TableLoopLayoutProps {
  userLength: number;
  children: ReactNode;
  direction?: "col" | "row";
  isDivide?: boolean;
  isActiveBorderTop?: boolean;
}
export function TableLoopLayout({
  userLength,
  children,
  direction,
  isDivide = true,
}: TableLoopLayoutProps) {
  const viewOptions = useReactiveVar(viewOptionsVar);

  return (
    <div
      className={`grid w-full${direction === "col" ? " h-full" : " h-5"}${
        isDivide ? " divide-x divide-blue-800" : ""
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
