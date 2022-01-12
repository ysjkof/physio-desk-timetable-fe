import React from "react";

interface ITimezoneLiProps {
  timezone: string | null | undefined;
}

export const TimezoneLi: React.FC<ITimezoneLiProps> = ({ timezone }) => (
  <div
    className="left-timezone-hour w-full text-xs font-extralight text-gray-400 px-2 flex flex-col justify-center content-end h-4"
    style={{
      borderTop: `${
        timezone?.substring(2) !== "00" &&
        timezone?.substring(2) !== "30" &&
        "none"
      }`,
    }}
  >
    {timezone?.charAt(2) === "0" ? (
      <span>{timezone}</span>
    ) : timezone?.charAt(2) === "3" ? (
      <span>{timezone}</span>
    ) : (
      ""
    )}
  </div>
);
