import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TimezoneLi } from "../patient/components/TimezoneLi";

export const TimeTable = () => {
  let timeArr = [];
  let i = 1000;
  for (let i = 1000; i < 1901; i = i + 100) {
    timeArr.push(i);
    if (timeArr.length > 30) {
      break;
    }
  }
  const [timezoneOption, setTimezoneOption] = useState(timeArr);

  const reserve = [
    {
      id: 1,
      name: "홍길동",
      gender: "남",
      startDate: "2022-01-06T09:00:00+0900",
    },
    {
      id: 2,
      name: "이영희",
      gender: "여",
      startDate: "2022-01-06T13:00:00+0900",
    },
  ];
  const gettt = (data: any) => {
    const fst = new Date(data);
    return fst.getTime();
  };

  return (
    <div className="time-grid container mx-auto bg-blue-500 h-full flex divide-x divide-solid">
      {/*  */}
      <div className="time-grid-left bg-indigo-400 w-10">
        <div className="timezone-container  bg-violet-700 flex flex-col divide-y divide-solid">
          {timezoneOption.map((timezone, index) => (
            <TimezoneLi key={index} label={timezone} />
          ))}
        </div>
      </div>
      {/*  */}
      <div className="time-grid-right relative bg-red-300 w-full">
        {/* --- */}
        <div className="time-grid-right-row flex absolute   flex-col divide-y divide-solid w-full">
          {timezoneOption.map((timezone, index) => (
            <div key={index} className="guideline flex-auto h-7"></div>
          ))}
        </div>
        {/* \\\ */}
        <div className="time-grid-right-col absolute  h-full w-full">
          <div className="schedule-container flex flex-col items-center w-full border-green-700">
            {reserve.map((rr) => (
              <div className="schedule" id={rr.startDate}>
                {rr.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
