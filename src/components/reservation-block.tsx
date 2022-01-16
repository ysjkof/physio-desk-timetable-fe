import {
  faFemale,
  faMale,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { getHHMM, getTimeLength, getYYMMDD } from "../hooks/handleTimeFormat";

interface IReservationBlock {
  timezone: string;
  row: number;
  startDate: Date;
  endDate: Date;
  registrationNumber: string | null;
  birthday: string;
  gender: string;
  name: string;
  memo: string | null;
  reservationsCount: number;
  reservationIndex: number;
}

export const ReservationBlock: React.FC<IReservationBlock> = ({
  timezone,
  row,
  startDate,
  endDate,
  registrationNumber,
  birthday,
  gender,
  name,
  memo,
  reservationsCount,
  reservationIndex,
}) => (
  <div
    className={`reserve${timezone} col-start-2 bg-blue-100/80 dark:bg-light-blue-600/50 border border-blue-700/20 dark:border-light-blue-500 rounded-lg  p-1 hover:scale-105 hover:bg-blue-200 w-2/3 mx-auto group my-1`}
    style={
      reservationsCount > 1
        ? {
            // 예약의 시작, 끝 시간을 계산해 분 단위로 얻고 한 칸이 10분이라서 10으로 나눠서 gridRowEnd 길이 적용
            gridRow: `${row + 1}/span ${
              getTimeLength(startDate, endDate) / 10
            }`,
            width: `${100 / reservationsCount}%`,
            margin: "0.25rem 0",
            position: "relative",
            left: `${((reservationIndex - 1) / reservationsCount) * 100}%`,
          }
        : {
            gridRow: `${row + 1}/span ${
              getTimeLength(startDate, endDate) / 10
            }`,
          }
    }
  >
    <div className="flex flex-col divide-y divide-solid divide-blue-300/70">
      <div className="flex justify-between items-baseline">
        <span className="text-xs text-blue-600 dark:text-light-blue-100 hidden group-hover:block group-hover:absolute  group-hover:top-[-20px]">
          {getHHMM(startDate, true)}~{getHHMM(endDate, true)}
        </span>
        {registrationNumber ? (
          <span className="text-xs text-blue-600 dark:text-light-blue-100">
            R : {registrationNumber}
          </span>
        ) : (
          <span className="text-xs text-blue-600 dark:text-light-blue-100">
            B : {getYYMMDD(birthday)}
          </span>
        )}
        <div className="flex gap-2 ">
          <span>
            {gender === "male" ? (
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
          <span className="text-sm font-medium text-blue-600 dark:text-light-blue-100">
            {/* <span className="font-bold text-sm group-hover:text-base"> */}
            {name}
          </span>
        </div>
        <div>
          <FontAwesomeIcon
            icon={faTrashAlt}
            className="text-sm text-blue-400 dark:text-light-blue-100"
          />
        </div>
      </div>
      <p className="break-all text-sm text-blue-600 text-center">{memo}</p>
    </div>
  </div>
);
