import React from "react";

interface ITimezoneLiProps {
  label: number | string | undefined;
}

export const TimezoneLi: React.FC<ITimezoneLiProps> = ({ label }) => (
  <div className="left-timezone-hour w-full bg-red-400 h-7 text-sm ">
    {label}
  </div>
);
