import { faFemale, faMale } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { getHHMM } from "../hooks/getHHMM";

interface IScheduleBlockContents {
  id: number;
  gender: string;
  name: string;
  memo: string | null;
  startDate: Date;
  endDate: Date;
}

function getScheduleHeight(startDate: any, endDate: any) {
  const getMinutes =
    Math.abs(new Date(startDate).getTime() - new Date(endDate).getTime()) /
    1000 /
    60;
  console.log("⚠️ :", Math.ceil(getMinutes / 10));
  return Math.ceil(getMinutes / 10);
}

export const ScheduleBlockContents: React.FC<IScheduleBlockContents> = ({
  id,
  gender,
  name,
  memo,
  startDate,
  endDate,
}) => (
  <div
    key={id}
    className="scheduleBlock-schedule group text-xs bg-white gap-1 border border-black rounded-sm px-2 cursor-pointer hover:bg-sky-500 hover:outline-sky-500 hover:border-none hover:scale-105 relative divide-y divide-solid divide-gray-300 text-blue-600"
    style={{
      minHeight: `${getScheduleHeight(startDate, endDate) * 0.75}rem`,
    }}
  >
    <div className="schedule-title flex justify-between  items-baseline gap-1 group-hover:text-white">
      <span>2930</span>
      <span>
        {gender === "male" ? (
          <FontAwesomeIcon
            icon={faMale}
            className=" text-blue-500 group-hover:text-white "
          />
        ) : (
          <FontAwesomeIcon
            icon={faFemale}
            className="text-pink-500 group-hover:text-white"
          />
        )}
      </span>
      <span className="font-bold text-sm group-hover:text-base">{name}</span>
      <span>101123</span>
      <span>
        {getHHMM(startDate, true)} ~ {getHHMM(endDate, true)}
      </span>
    </div>
    <div>
      <span className="group-hover:text-white">{memo}</span>
    </div>
  </div>
);
