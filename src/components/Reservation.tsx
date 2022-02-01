import { faFemale, faMale } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { getHHMM, getTimeLength, getYMD } from "../hooks/handleTimeFormat";

interface IReservation {
  date: Date;
  rIndex: number;
  gridColStart: number;
  gridRowStart: number;
  timezoneLength: number;
  startDate: Date;
  endDate: Date;
  lastModifier: string;
  memo: string | null;
  state: string;
  patientName: string;
  patientGender: string;
  patientBirthday: string | Date;
  patientRegistrationNumber: string | null;
}

export const Reservation: React.FC<IReservation> = ({
  date,
  rIndex,
  gridColStart,
  gridRowStart,
  timezoneLength,
  startDate,
  endDate,
  lastModifier,
  memo,
  state,
  patientName,
  patientGender,
  patientBirthday,
  patientRegistrationNumber,
}) => {
  return (
    <div
      className={`${date.getDay()}-${rIndex} c-col-start-${gridColStart} dark:bg-light-blue-600/50 dark:border-light-blue-500 group mx-auto my-1 w-2/3  rounded-lg border border-blue-700/20 bg-blue-100/60 p-1 hover:scale-105 hover:bg-blue-200`}
      style={
        timezoneLength > 1
          ? {
              // 예약의 시작, 끝 시간을 계산해 분 단위로 얻고 한 칸이 10분이라서 10으로 나눠서 gridRowEnd 길이 적용
              gridRow: `${gridRowStart}/span ${
                getTimeLength(startDate, endDate) / 10
              }`,
              width: `${100 / timezoneLength}%`,
              margin: "0.25rem 0",
              position: "relative",
              left: `${(rIndex / timezoneLength) * 100}%`,
            }
          : {
              // gridColumnStart: `${gridColStart}`,
              // 예약의 시작, 끝 시간을 계산해 분 단위로 얻고 한 칸이 10분이라서 10으로 나눠서 gridRowEnd 길이 적용
              gridRow: `${gridRowStart}/span ${
                getTimeLength(startDate, endDate) / 10
              }`,
            }
      }
    >
      <div className="flex flex-col divide-y divide-solid divide-blue-300/70">
        <div className="flex items-baseline justify-between">
          <span className="dark:text-light-blue-100 hidden text-xs text-blue-600 group-hover:absolute group-hover:top-[-20px]  group-hover:block">
            {getHHMM(startDate, ":")}~{getHHMM(endDate, ":")}
          </span>

          <div className="flex gap-2 ">
            <span>
              {patientGender === "male" ? (
                <FontAwesomeIcon
                  icon={faMale}
                  className=" text-blue-500 group-hover:text-white"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faFemale}
                  className="text-pink-500 group-hover:text-white"
                />
              )}
            </span>
            <span className="dark:text-light-blue-100 text-sm font-medium text-blue-600">
              {/* <span className="font-bold text-sm group-hover:text-base"> */}
              {patientName}
            </span>
          </div>
          {patientRegistrationNumber ? (
            <span className="dark:text-light-blue-100 text-xs text-blue-600">
              R : {patientRegistrationNumber}
            </span>
          ) : (
            <span className="dark:text-light-blue-100 text-xs text-blue-600">
              B : {getYMD(patientBirthday, "yymmdd")}
            </span>
          )}
        </div>
        <p className="break-all text-center text-sm text-blue-600">{memo}</p>
      </div>
    </div>
  );
};
