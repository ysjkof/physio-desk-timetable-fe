import React from "react";

interface ITimezoneLiProps {
  label: string | null | undefined;
}

export const TimezoneLi: React.FC<ITimezoneLiProps> = ({ label }) => (
  <div
    className="left-timezone-hour w-full bg-red-400 text-sm "
    style={{ height: "28px" }}
  >
    {label}
  </div>
);
