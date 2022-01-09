import React from "react";

interface ITimezoneLiProps {
  label: string | null | undefined;
}

export const TimezoneLi: React.FC<ITimezoneLiProps> = ({ label }) => (
  <div
    className={`left-timezone-hour w-full text-xs font-extralight text-gray-400 px-2 flex flex-col justify-center content-end h-3
      ${label === "label" ? " bg-gray-50 rounded-tl-md" : ""}`}
  >
    {label === "label" ? <span>시간</span> : null}
    {label?.charAt(2) === "0" ? (
      <span>{label}</span>
    ) : label?.charAt(2) === "3" ? (
      <span>{label}</span>
    ) : (
      ""
    )}
  </div>
);
