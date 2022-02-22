import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cls, getHHMM, getTimeLength } from "../libs/utils";
import { NameTag } from "./name-tag";

interface IScheduleBox {
  id: number;
  // gridRowStart: number;
  // gridRowEnd: number;
  hhmm: string;
  memo: string | null;
  startDate: Date;
  endDate: Date;
  gender: string;
  patientName: string;
  registrationNumber: string | null;
  birthday: Date;
  shrink?: boolean;
  canClick?: boolean;
}

export const ScheduleBox: React.FC<IScheduleBox> = ({
  id,
  // gridRowStart,
  // gridRowEnd,
  hhmm,
  memo,
  startDate,
  endDate,
  gender,
  patientName,
  registrationNumber,
  birthday,
  shrink = false,
  canClick,
}) => {
  const navigate = useNavigate();
  // onClick => 수정 || 삭제
  const timeLength = getTimeLength(startDate, endDate);
  const onClick = () => {
    console.log("you click ScheduleBox");
  };
  return (
    <>
      <div
        className={cls(
          "group relative col-start-2 rounded-md border bg-white transition duration-200 hover:z-50 hover:cursor-pointer hover:border-transparent hover:ring-2 hover:ring-gray-900",
          shrink ? "w-[146px]" : ""
        )}
        // style={{
        //   gridRowStart,
        //   gridRowEnd,
        // }}
        id={hhmm}
        onClick={onClick}
      >
        <NameTag
          id={id}
          gender={gender}
          name={patientName}
          registrationNumber={registrationNumber}
          birthday={birthday}
          shrink={shrink}
        />
        <div
          className={cls(
            timeLength === 20
              ? "h-[24px]"
              : timeLength === 30
              ? "h-[48px]"
              : timeLength === 40
              ? "h-[72px]"
              : timeLength === 50
              ? "h-[120px]"
              : timeLength === 60
              ? "h-[144px]"
              : timeLength === 70
              ? "h-[168px]"
              : timeLength === 80
              ? "h-[192px]"
              : timeLength === 90
              ? "h-[216px]"
              : ""
          )}
        >
          <span className="block text-sm text-gray-600">{memo}</span>
        </div>
        <div className="absolute -top-6 right-1/2 hidden translate-x-1/2 rounded-lg border bg-white px-4 text-gray-500 shadow group-hover:block group-hover:ring-2 group-hover:ring-gray-900">
          {getHHMM(startDate)}~{getHHMM(endDate)}
        </div>
      </div>
    </>
  );
};
