import React from "react";

interface ITimezoneLiProps {
  label: string | null | undefined;
}

export const TimezoneLi: React.FC<ITimezoneLiProps> = ({ label }) => (
  <div
    className={`left-timezone-hour w-full text-xs font-extralight text-gray-400 px-2 flex flex-col justify-center content-end
      ${label === "label" ? " bg-gray-50 rounded-tl-md" : ""}`}
    style={{ height: "28px" }}
  >
    <span className="">{label === "label" ? "시간" : label}</span>
  </div>
);
