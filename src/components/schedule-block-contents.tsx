import { faFemale, faMale } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { getHHMM } from "../hooks/handleTimeFormat";

interface IScheduleBlockContents {
  timezone: string;
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
  return Math.ceil(getMinutes / 10);
}

export const ScheduleBlockContents: React.FC<IScheduleBlockContents> = ({
  gender,
  name,
  memo,
  startDate,
  endDate,
}) => (
  // <div className="bg-white relative group hover:bg-blue-400 hover:border-blue-700 hover:divide-blue-700 ">
  <div
    className="scheduleBlock-schedule group text-xs  bg-sky-400/20 gap-1 border border-black rounded-sm px-2 cursor-pointer hover:bg-sky-500 hover:outline-sky-500 hover:border-none hover:scale-105 relative divide-y divide-solid divide-white text-blue-600"
    // className="bg-blue-400/20 dark:bg-light-blue-600/50 border border-blue-700/10 dark:border-light-blue-500 rounded-lg m-1 divide-y divide-solid divide-blue-700/40"
    style={{
      minHeight: `${getScheduleHeight(startDate, endDate) * 0.75}rem`,
    }}
  >
    {/* <div className="text-xs text-blue-600 dark:text-light-blue-100  flex justify-between  items-baseline gap-1 group-hover:text-white"> */}
    <div className="schedule-title flex justify-between  items-baseline gap-1 group-hover:text-white">
      <span>
        {getHHMM(startDate, true)} ~ {getHHMM(endDate, true)}
      </span>
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
      <button>EDIT</button>
    </div>
    <div>
      {/* <span className="text-xs text-blue-600 dark:text-light-blue-100">
          {memo}
        </span> */}
      <span className="group-hover:text-white">{memo}</span>
    </div>
  </div>
  // </div>
);
