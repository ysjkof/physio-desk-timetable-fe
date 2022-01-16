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
}) => (
  <div
    className={`reserve${timezone} col-start-2 bg-blue-100/80 dark:bg-light-blue-600/50 border border-blue-700/10 dark:border-light-blue-500 rounded-lg sm:m-1 sm:p-1 hover:scale-105 hover:bg-blue-200`}
    style={{
      // 예약의 시작, 끝 시간을 계산해 분 단위로 얻고 한 칸이 10분이라서 10으로 나눠서 gridRowEnd 길이 적용
      gridRow: `${row + 1}/span ${getTimeLength(startDate, endDate) / 10}`,
    }}
  >
    <div className="grid grid-cols-4 justify-items-center overflow-auto items-baseline">
      <span className="text-xs text-blue-600 dark:text-light-blue-100">
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
      <div className="flex gap-2">
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
        <span className="text-sm font-medium text-blue-600 dark:text-light-blue-100">
          {/* <span className="font-bold text-sm group-hover:text-base"> */}
          {name}
        </span>
      </div>
      <div className="flex gap-3">
        <span className="text-sm font-medium text-blue-600 dark:text-light-blue-100">
          EDIT
        </span>
        <FontAwesomeIcon icon={faTrashAlt} className="text-red-400" />
      </div>
      <span className="col-span-4  break-all text-sm text-blue-600">
        {memo}
      </span>
    </div>
  </div>
);
